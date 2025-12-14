import { createClient } from '@/lib/supabase/client';
import { Availability, AvailabilityService } from './availability-service';
import { parseISO } from 'date-fns';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'lesson' | 'availability';
  status?: string; // for lessons
  extendedProps?: any; // To store original object
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  display?: string; // 'background' etc
}

export const CalendarService = {
  async getInstructorCalendarData(userId: string, startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    const supabase = createClient();
    const events: CalendarEvent[] = [];

    // 1. Fetch Availability
    const availability = await AvailabilityService.getAvailability(userId, startDate, endDate);
    
    // Map availability to events
    availability.forEach(slot => {
      events.push({
        id: `avail-${slot.id}`,
        title: 'Available',
        start: parseISO(slot.start_time),
        end: parseISO(slot.end_time),
        type: 'availability',
        display: 'background', // Show as background color
        backgroundColor: '#ECFDF5',
        borderColor: '#10B981',
        extendedProps: { ...slot },
      });
    });

    // 2. Fetch Bookings (Lessons)
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        lesson_id,
        start_time,
        end_time,
        status,
        lesson:lessons(name),
        customer:customer_id(full_name)
      `)
      .eq('instructor_id', userId)
      .gte('start_time', startDate.toISOString())
      .lte('end_time', endDate.toISOString());

    if (error) throw new Error(error.message);

    bookings?.forEach((booking: any) => {
       let color = '#FBBF24'; // Pending
       if (booking.status === 'confirmed') color = '#4A90E2'; // Confirmed
       if (booking.status === 'cancelled') color = '#ef4444'; // red-500

      events.push({
        id: `booking-${booking.id}`,
        title: `${booking.lesson?.name || 'Lesson'} - ${booking.customer?.full_name || 'Student'}`,
        start: parseISO(booking.start_time),
        end: parseISO(booking.end_time),
        type: 'lesson',
        status: booking.status,
        backgroundColor: color,
        borderColor: color,
        extendedProps: { ...booking },
      });
    });

    return events;
  }
};
