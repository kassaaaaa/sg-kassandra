'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import { CalendarApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Ban
} from 'lucide-react';
import {
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group";
import { useInstructorCalendar } from '@/lib/hooks/useInstructorCalendar';
import { AddAvailabilityDialog } from '@/components/calendar/AddAvailabilityDialog';
import { createClient } from '@/lib/supabase/client';
import { LessonDetailsModal } from '@/components/bookings/LessonDetailsModal';
import { BlockTimeDialog } from '@/components/calendar/BlockTimeDialog';
import { ManagerBooking } from '@/lib/hooks/useManagerDashboard';

type View = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

export function InstructorCalendar() {
  const calendarRef = useRef < FullCalendar > (null);
  const {
    events,
    setDateRange
  } = useInstructorCalendar();
  const [isAddAvailabilityOpen, setIsAddAvailabilityOpen] = useState(false);
  const [isBlockTimeOpen, setIsBlockTimeOpen] = useState(false);
  const [isLessonDetailsOpen, setIsLessonDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState < ManagerBooking | null > (null);
  const [userId, setUserId] = useState < string > ('');
  const [calendarApi, setCalendarApi] = useState < CalendarApi | null > (null);
  const [title, setTitle] = useState('');
  const [view, setView] = useState < View > ('timeGridWeek');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({
      data
    }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      setCalendarApi(api);
      setTitle(api.getCurrentData().viewTitle);
    }
  }, []);

  const handleDatesSet = useCallback((dateInfo: any) => {
    setDateRange({
      start: dateInfo.start,
      end: dateInfo.end
    });
    setTitle(dateInfo.view.title);
  }, [setDateRange]);


  const handleEventClick = (info: any) => {
    const event = info.event;
    if (event.extendedProps.type === 'lesson') {
      setSelectedEvent(event.extendedProps as ManagerBooking);
      setIsLessonDetailsOpen(true);
    }
  };

  const handleViewChange = (newView: View) => {
    if (calendarApi && newView) {
      calendarApi.changeView(newView);
      setView(newView);
    }
  };
  
  const handleToday = () => calendarApi?.today();
  const handlePrev = () => calendarApi?.prev();
  const handleNext = () => calendarApi?.next();

  return ( 
  <div className = "space-y-4 h-[calc(100vh-120px)] flex flex-col bg-background rounded-lg border" >
    <div className = "flex items-center justify-between p-4 border-b flex-wrap gap-2" >
      <h2 className = "text-lg font-semibold" > {title} </h2> 
        <div className = "flex items-center gap-4 flex-wrap" >
        <div className = "flex items-center gap-2" >
        <Button variant = "outline" size = "sm" onClick = {handleToday} > Today </Button> 
          <ToggleGroup type = "single" value = {view} onValueChange = {handleViewChange} aria-label = "Calendar View" >
          <ToggleGroupItem value = "dayGridMonth" aria-label = "Month view" > Month </ToggleGroupItem> 
          <ToggleGroupItem value = "timeGridWeek" aria-label = "Week view" > Week </ToggleGroupItem> 
          <ToggleGroupItem value = "timeGridDay" aria-label = "Day view" > Day </ToggleGroupItem> 
          <ToggleGroupItem value = "listWeek" aria-label = "Agenda view" > Agenda </ToggleGroupItem> 
          </ToggleGroup> 
        </div> 
        <div className = "flex items-center gap-2" >
        <Button variant = "outline" size = "icon" onClick = {handlePrev} >
        <ChevronLeft className = "h-4 w-4" />
        </Button> 
        <Button variant = "outline" size = "icon" onClick = {handleNext} >
        <ChevronRight className = "h-4 w-4" />
        </Button> 
        </div> 
        <div className = "flex items-center gap-2" >
        <Button onClick = {() => setIsAddAvailabilityOpen(true)} >
        <Plus className = "mr-2 h-4 w-4" /> Add Availability 
        </Button> 
        <Button variant = "outline" onClick = {() => setIsBlockTimeOpen(true)} >
        <Ban className = "mr-2 h-4 w-4" /> Block Time 
        </Button> 
        </div> 
      </div> 
    </div>

    <div className = "flex-1 p-4 rounded-lg overflow-hidden" >
    <FullCalendar ref = {calendarRef}
    plugins = {[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
    initialView = {view}
    headerToolbar = {false} // We are using a custom header
    events = {events}
    datesSet = {handleDatesSet}
    eventClick = {handleEventClick}
    height = "100%"
    slotMinTime = "07:00:00"
    slotMaxTime = "22:00:00"
    allDaySlot = {false}
    nowIndicator = {true}
    /> 
    </div>

    {userId && ( 
    <AddAvailabilityDialog open = {isAddAvailabilityOpen}
      onOpenChange = {setIsAddAvailabilityOpen}
      instructorId = {userId}
      />
    )}

    <BlockTimeDialog open = {isBlockTimeOpen}
    onOpenChange = {setIsBlockTimeOpen}
    />

    <LessonDetailsModal isOpen = {isLessonDetailsOpen}
    onClose = {() => setIsLessonDetailsOpen(false)}
    booking = {selectedEvent}
    /> 
    </div>
  );
}