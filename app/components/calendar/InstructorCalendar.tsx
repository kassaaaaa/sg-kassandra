'use client';

import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Button } from '@/components/ui/button';
import { Plus, Ban } from 'lucide-react';
import { useInstructorCalendar } from '@/lib/hooks/useInstructorCalendar';
import { AddAvailabilityDialog } from '@/components/calendar/AddAvailabilityDialog';
import { createClient } from '@/lib/supabase/client';
import { LessonDetailsModal } from '@/components/bookings/LessonDetailsModal';
import { BlockTimeDialog } from '@/components/calendar/BlockTimeDialog';
import { ManagerBooking } from '@/lib/hooks/useManagerDashboard';

export function InstructorCalendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const { events, isLoading, setDateRange } = useInstructorCalendar();
  const [isAddAvailabilityOpen, setIsAddAvailabilityOpen] = useState(false);
  const [isBlockTimeOpen, setIsBlockTimeOpen] = useState(false);
  const [isLessonDetailsOpen, setIsLessonDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ManagerBooking | null>(null);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
     const supabase = createClient();
     supabase.auth.getUser().then(({ data }) => {
        if (data.user) setUserId(data.user.id);
     });
  }, []);

  const handleDatesSet = (dateInfo: any) => {
    setDateRange({ start: dateInfo.start, end: dateInfo.end });
  };

  const handleEventClick = (info: any) => {
    const event = info.event;
    if (event.extendedProps.type === 'lesson') {
      // Pass the booking object from extendedProps
      setSelectedEvent(event.extendedProps as ManagerBooking);
      setIsLessonDetailsOpen(true);
    }
  };

  return (
    <div className="space-y-4 h-[calc(100vh-120px)] flex flex-col">
       <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold">My Calendar</h2>
         <div className="flex space-x-2">
            <Button onClick={() => setIsAddAvailabilityOpen(true)}>
               <Plus className="mr-2 h-4 w-4" /> Add Availability
            </Button>
            <Button variant="outline" onClick={() => setIsBlockTimeOpen(true)}>
               <Ban className="mr-2 h-4 w-4" /> Block Time
            </Button>
         </div>
       </div>

       <div className="flex-1 bg-white p-4 rounded-lg shadow overflow-hidden">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            events={events}
            datesSet={handleDatesSet}
            eventClick={handleEventClick}
            height="100%"
            slotMinTime="07:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={false}
            nowIndicator={true}
          />
       </div>

       {userId && (
         <AddAvailabilityDialog 
            open={isAddAvailabilityOpen} 
            onOpenChange={setIsAddAvailabilityOpen}
            instructorId={userId}
         />
       )}

       <BlockTimeDialog
            open={isBlockTimeOpen}
            onOpenChange={setIsBlockTimeOpen}
        />

       <LessonDetailsModal
          isOpen={isLessonDetailsOpen}
          onClose={() => setIsLessonDetailsOpen(false)}
          booking={selectedEvent} 
       />
    </div>
  );
}