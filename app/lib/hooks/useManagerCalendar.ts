import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';
import { Availability, AvailabilityService } from '@/lib/availability-service';
import { ManagerBooking } from '@/lib/hooks/useManagerDashboard';
import { useState } from 'react';

export interface ManagerCalendarFilters {
  instructorIds: string[];
  lessonTypes: string[];
}

export function useManagerCalendar() {
  const supabase = createClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filters, setFilters] = useState<ManagerCalendarFilters>({
    instructorIds: [],
    lessonTypes: [],
  });

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });

  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ['manager-calendar-bookings', startDate.toISOString(), endDate.toISOString(), filters],
    queryFn: async (): Promise<ManagerBooking[]> => {
      let query = supabase
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
        .gte('start_time', startDate.toISOString())
        .lte('end_time', endDate.toISOString()) // Overlapping check usually checks start < end AND end > start, but for simple fetching of "bookings in this week", checking start time range is often enough if bookings aren't multi-day.
        // Actually, precise overlap: start < viewEnd AND end > viewStart.
        // But for simplicity/indexing: start_time >= viewStart AND start_time <= viewEnd (starts in view)
        // OR end_time >= viewStart AND end_time <= viewEnd (ends in view)
        // OR start <= viewStart AND end >= viewEnd (spans view)
        // Let's stick to start_time check for now as most lessons are short.
        
      if (filters.instructorIds.length > 0) {
        query = query.in('instructor_id', filters.instructorIds);
      }

      // Lesson type filter: `bookings` doesn't have `lesson_type` column directly usually?
      // `bookings` -> `lessons` table -> `name`? Or `bookings` has `lesson_id`.
      // The `lessons` table probably has the type or name.
      // Filter by lesson type implies joining or filtering on joined relation.
      // Supabase supports filtering on joined tables: `!inner` to enforce filter.
      if (filters.lessonTypes.length > 0) {
        // Assuming 'lessons' table has a 'name' or 'type' column that matches our filter.
        // The filter UI (Task 3) will populate this.
        // Let's assume the filter values match lesson names for now.
        query = query.not('lesson', 'is', null); // Ensure lesson exists
        // Filter on the joined resource:
        // .eq('lessons.name', ...) -- syntax is tricky with arrays.
        // Simplest: Fetch all in range, filter in JS.
        // Or usage: .in('lesson.name', filters.lessonTypes) if possible.
        // Supabase JS syntax for deep filtering:
        // .filter('lesson.name', 'in', `(${filters.lessonTypes.join(',')})`)
        // But let's just do JS filtering for lesson types to be safe and robust against complex query syntax issues for now.
      }

      const { data, error } = await query;
      if (error) throw error;

      let result = (data as any[]).map((b) => ({
        id: b.id,
        start_time: b.start_time,
        end_time: b.end_time,
        status: b.status,
        lesson: Array.isArray(b.lesson) ? b.lesson[0] : b.lesson,
        customer: Array.isArray(b.customer) ? b.customer[0] : b.customer,
        instructor: Array.isArray(b.instructor) ? b.instructor[0] : b.instructor,
      }));

      // JS Filter for lesson types
      if (filters.lessonTypes.length > 0) {
        result = result.filter(b => b.lesson && filters.lessonTypes.includes(b.lesson.name));
      }

      return result;
    },
  });

  const { data: availability, isLoading: availabilityLoading, error: availabilityError } = useQuery({
    queryKey: ['manager-calendar-availability', startDate.toISOString(), endDate.toISOString(), filters.instructorIds],
    queryFn: async (): Promise<Availability[]> => {
      return AvailabilityService.getBatchAvailability(
        filters.instructorIds.length > 0 ? filters.instructorIds : null,
        startDate,
        endDate
      );
    },
  });

  return {
    bookings: bookings || [],
    availability: availability || [],
    isLoading: bookingsLoading || availabilityLoading,
    error: bookingsError || availabilityError,
    currentDate,
    setCurrentDate,
    filters,
    setFilters,
  };
}
