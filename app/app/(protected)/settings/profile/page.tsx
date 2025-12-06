
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

const instructorProfileSchema = z.object({
  certifications: z.string().optional(),
  lesson_types: z.string().optional(),
});

type InstructorProfileFormValues = z.infer<typeof instructorProfileSchema>;

export default function ProfileSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const form = useForm<InstructorProfileFormValues>({
    resolver: zodResolver(instructorProfileSchema),
    defaultValues: {
      certifications: '',
      lesson_types: '',
    },
  });

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('User not authenticated.');
        setLoading(false);
        return;
      }
      setUserId(user.id);

      const { data, error } = await supabase
        .from('instructor_details')
        .select('certifications, lesson_types')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found (new instructor)
        toast.error('Failed to fetch profile: ' + error.message);
      } else if (data) {
        form.reset({
          certifications: data.certifications?.join(', ') || '',
          lesson_types: data.lesson_types?.join(', ') || '',
        });
      }
      setLoading(false);
    }

    fetchProfile();
  }, [supabase, form]);

  async function onSubmit(values: InstructorProfileFormValues) {
    if (!userId) {
      toast.error('User ID not available. Please log in again.');
      return;
    }

    setLoading(true);

    const certificationsArray = values.certifications
      ? values.certifications.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const lessonTypesArray = values.lesson_types
      ? values.lesson_types.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const { error } = await supabase
      .from('instructor_details')
      .upsert(
        {
          user_id: userId,
          certifications: certificationsArray,
          lesson_types: lessonTypesArray,
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Supabase update error:', error);
      toast.error('Failed to update profile: ' + error.message);
    } else {
      console.log('Profile updated successfully!');
      toast.success('Profile updated successfully!');
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="p-4">Loading profile...</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <h3 className="text-lg font-medium">Instructor Profile</h3>
      <p className="text-sm text-muted-foreground">
        Manage your professional profile, certifications, and lesson types.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="certifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certifications</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., ISA Level 1, Red Cross First Aid (comma-separated)"
                    className="resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  List your certifications, separated by commas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lesson_types"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Types</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Surf Coaching, Paddleboarding, Kitesurfing (comma-separated)"
                    className="resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  List the types of lessons you can teach, separated by commas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Update profile'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
