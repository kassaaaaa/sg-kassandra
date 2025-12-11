import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface Instructor {
  id: string;
  full_name: string;
}

export function useInstructors() {
  const supabase = createClient();
  return useQuery({
    queryKey: ['instructors'],
    queryFn: async (): Promise<Instructor[]> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'instructor')
        .order('full_name');
      
      if (error) throw error;
      return data as Instructor[];
    },
  });
}

export function useLessonTypes() {
  const supabase = createClient();
  return useQuery({
    queryKey: ['lesson-types'],
    queryFn: async (): Promise<string[]> => {
      // Fetch from school_settings
      const { data, error } = await supabase
        .from('school_settings')
        .select('lesson_types')
        .single();
      
      if (error) {
        // Fallback or error?
        console.error('Error fetching school settings:', error);
        return ['Kite', 'Wing', 'Surf']; // Fallback for dev/demo
      }

      // lesson_types is JSONB. Assuming it's an array of strings or objects.
      // Tech spec says: lesson_types: JSONB (configurable list)
      // Let's assume array of strings or array of objects with name.
      // We'll cast safely.
      const types = data.lesson_types;
      if (Array.isArray(types)) {
          return types.map((t: any) => typeof t === 'string' ? t : t.name);
      }
      return [];
    },
  });
}
