import { createClient } from '@/lib/supabase/client';

export type InstructorProfile = {
  certifications: string[] | null;
  lesson_types: string[] | null;
};

export const ProfileService = {
  async getProfile(userId: string): Promise<InstructorProfile | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('instructor_details')
      .select('certifications, lesson_types')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(error.message);
    }

    return data;
  },

  async updateProfile(userId: string, profile: InstructorProfile): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('instructor_details')
      .upsert(
        {
          user_id: userId,
          certifications: profile.certifications,
          lesson_types: profile.lesson_types,
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      throw new Error(error.message);
    }
  },
};
