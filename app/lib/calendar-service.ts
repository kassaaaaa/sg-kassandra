import { createClient } from '@/lib/supabase/client';
import { Availability, AvailabilityService } from './availability-service';

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
        start: new Date(slot.start_time),
        end: new Date(slot.end_time),
        type: 'availability',
        display: 'background', // Show as background color
        backgroundColor: '#e5e7eb', // gray-200
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
       let color = '#3b82f6'; // blue-500 default
       if (booking.status === 'confirmed') color = '#22c55e'; // green-500
       if (booking.status === 'cancelled') color = '#ef4444'; // red-500

      events.push({
        id: `booking-${booking.id}`,
        title: `${booking.lesson?.name || 'Lesson'} - ${booking.customer?.full_name || 'Student'}`,
        start: new Date(booking.start_time),
        end: new Date(booking.end_time),
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
