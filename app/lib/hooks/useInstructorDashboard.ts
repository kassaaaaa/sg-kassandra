import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { startOfDay, endOfDay, addDays, format } from 'date-fns';

export interface DashboardStats {
  todayLessonCount: number;
  pendingBookingCount: number;
  // availableHours: number; // To be implemented later if needed
}

export interface Booking {
  id: number;
  start_time: string;
  end_time: string;
  status: string;
  lesson: {
    name: string; // Changed from title to name (table column)
  };
  profiles: { 
    full_name: string;
    email: string;
  };
}

export function useInstructorDashboard(instructorId?: string) {
  const supabase = createClient();

  // Query for stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', instructorId],
    queryFn: async (): Promise<DashboardStats> => {
      if (!instructorId) return { todayLessonCount: 0, pendingBookingCount: 0 };

      const todayStart = startOfDay(new Date()).toISOString();
      const todayEnd = endOfDay(new Date()).toISOString();

      // 1. Today's Lessons Count
      const { count: todayCount, error: todayError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('instructor_id', instructorId)
        .gte('start_time', todayStart)
        .lte('start_time', todayEnd)
        .neq('status', 'cancelled');

      if (todayError) throw todayError;

      // 2. Pending Bookings Count
      const { count: pendingCount, error: pendingError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('instructor_id', instructorId)
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      return {
        todayLessonCount: todayCount || 0,
        pendingBookingCount: pendingCount || 0,
      };
    },
    enabled: !!instructorId,
  });

  // Query for Upcoming Lessons (Today and Tomorrow)
  const { data: upcomingLessons, isLoading: lessonsLoading, error: lessonsError } = useQuery({
    queryKey: ['upcoming-lessons', instructorId],
    queryFn: async () => {
      if (!instructorId) return [];

      const todayStart = startOfDay(new Date()).toISOString();
      const tomorrowEnd = endOfDay(addDays(new Date(), 1)).toISOString();

      // Note: bookings -> lessons (foreign key lesson_id)
      // bookings -> profiles (foreign key customer_id)
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          start_time,
          end_time,
          status,
          lesson:lessons(name),
          profiles:customer_id(full_name, email)
        `)
        .eq('instructor_id', instructorId)
        .gte('start_time', todayStart)
        .lte('start_time', tomorrowEnd)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Upcoming Lessons Query Error:', error);
        throw error;
      }
      return data;
    },
    enabled: !!instructorId,
  });

  return {
    stats,
    upcomingLessons,
    isLoading: statsLoading || lessonsLoading,
    error: lessonsError, // Expose error
  };
}
