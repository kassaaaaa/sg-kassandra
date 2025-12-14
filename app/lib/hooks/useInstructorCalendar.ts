import { useQuery } from '@tanstack/react-query';
import { CalendarService, CalendarEvent } from '@/lib/calendar-service';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

export function useInstructorCalendar() {
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const { data: role } = useUserRole();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUser();
  }, []);

  const { data: events, isLoading, error, refetch } = useQuery({
    queryKey: ['instructor-calendar', userId, dateRange?.start.toISOString(), dateRange?.end.toISOString()],
    queryFn: async () => {
        if (!userId || !dateRange) return [];
        return CalendarService.getInstructorCalendarData(userId, dateRange.start, dateRange.end);
    },
    enabled: !!userId && !!dateRange && role === 'instructor',
  });

  return {
    events: events || [],
    isLoading,
    error,
    setDateRange,
    refetch
  };
}
