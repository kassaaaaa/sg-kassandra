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
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from '@/lib/profile-service';

const instructorProfileSchema = z.object({
  certifications: z.string().trim().optional(),
  lesson_types: z.string().trim().optional(),
});

type InstructorProfileFormValues = z.infer<typeof instructorProfileSchema>;

export default function ProfileSettingsPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      return user;
    }
  });

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => ProfileService.getProfile(user!.id),
    enabled: !!user?.id,
  });

  const form = useForm<InstructorProfileFormValues>({
    resolver: zodResolver(instructorProfileSchema),
    defaultValues: {
      certifications: '',
      lesson_types: '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        certifications: profile.certifications?.join(', ') || '',
        lesson_types: profile.lesson_types?.join(', ') || '',
      });
    }
  }, [profile, form]);

  const mutation = useMutation({
    mutationFn: async (values: InstructorProfileFormValues) => {
      if (!user?.id) throw new Error("No user ID");

      const certificationsArray = values.certifications
        ? values.certifications.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      const lessonTypesArray = values.lesson_types
        ? values.lesson_types.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      await ProfileService.updateProfile(user.id, {
        certifications: certificationsArray,
        lesson_types: lessonTypesArray
      });
    },
    onSuccess: () => {
      console.log('Profile updated successfully!');
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error('Failed to update profile: ' + error.message);
    }
  });

  function onSubmit(values: InstructorProfileFormValues) {
    mutation.mutate(values);
  }

  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) {
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
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Update profile'}
          </Button>
        </form>
      </Form>
    </div>
  );
}