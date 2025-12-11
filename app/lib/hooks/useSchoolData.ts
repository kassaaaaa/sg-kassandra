import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface Instructor {
  id: string;
  full_name: string;
}

export interface Customer {
  id: string;
  full_name: string;
}

export interface Lesson {
  id: number;
  name: string;
  duration_minutes: number;
}

export function useLessons() {
  const supabase = createClient();
  return useQuery({
    queryKey: ['lessons'],
    queryFn: async (): Promise<Lesson[]> => {
      const { data, error } = await supabase
        .from('lessons')
        .select('id, name, duration_minutes')
        .eq('active', true)
        .order('name');
      
      if (error) throw error;
      return data as Lesson[];
    },
  });
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

export function useCustomers() {
  const supabase = createClient();
  return useQuery({
    queryKey: ['customers'],
    queryFn: async (): Promise<Customer[]> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'customer')
        .order('full_name');
      
      if (error) throw error;
      return data as Customer[];
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
