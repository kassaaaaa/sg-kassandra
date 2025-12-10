import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { startOfDay, endOfDay } from 'date-fns';

export interface ManagerDashboardStats {
  todayLessonCount: number;
  pendingBookingCount: number;
  availableInstructorsCount: number;
  weatherConflictCount: number;
}

export interface ManagerBooking {
  id: number;
  start_time: string;
  end_time: string;
  status: string;
  lesson: { name: string } | null;
  customer: { full_name: string; email: string } | null;
  instructor: { full_name: string } | null;
}

interface RawManagerBooking {
  id: number;
  start_time: string;
  end_time: string;
  status: string;
  lesson: { name: string } | { name: string }[] | null;
  customer: { full_name: string; email: string } | { full_name: string; email: string }[] | null;
  instructor: { full_name: string } | { full_name: string }[] | null;
}

export function useManagerDashboard() {
  const supabase = createClient();

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['manager-dashboard-stats'],
    // ... (existing queryFn)
  });

  const { data: upcomingLessons, isLoading: lessonsLoading, error: lessonsError } = useQuery({
    queryKey: ['manager-upcoming-lessons'],
    queryFn: async (): Promise<ManagerBooking[]> => {
      const todayStart = startOfDay(new Date()).toISOString();
      const todayEnd = endOfDay(new Date()).toISOString();

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          start_time,
          end_time,
          status,
          lesson:lessons(name),
          customer:customer_id(full_name, email),
          instructor:instructor_id(full_name)
        `)
        .gte('start_time', todayStart)
        .lte('start_time', todayEnd)
        .order('start_time', { ascending: true });

      if (error) throw error;

      return (data as any[]).map((b) => ({
        id: b.id,
        start_time: b.start_time,
        end_time: b.end_time,
        status: b.status,
        lesson: Array.isArray(b.lesson) ? b.lesson[0] : b.lesson,
        customer: Array.isArray(b.customer) ? b.customer[0] : b.customer,
        instructor: Array.isArray(b.instructor) ? b.instructor[0] : b.instructor,
      }));
    },
  });

  return { 
    stats, 
    upcomingLessons,
    isLoading: statsLoading || lessonsLoading, 
    error: statsError || lessonsError 
  };
}
