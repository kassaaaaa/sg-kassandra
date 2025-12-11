'use client';

import React from 'react';
import { ManagerCalendar } from '@/components/calendar/ManagerCalendar';
import { CalendarFilters } from '@/components/calendar/CalendarFilters';
import { useManagerCalendar } from '@/lib/hooks/useManagerCalendar';
import { useInstructors, useLessonTypes } from '@/lib/hooks/useSchoolData';

export default function ManagerCalendarPage() {
  const { 
    bookings, 
    availability, 
    isLoading, 
    currentDate, 
    setCurrentDate,
    filters,
    setFilters
  } = useManagerCalendar();

  const { data: instructors = [] } = useInstructors();
  const { data: lessonTypes = [] } = useLessonTypes();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Master Calendar</h1>
          <p className="text-muted-foreground">
            View all school activities and instructor schedules.
          </p>
        </div>
      </div>

      <CalendarFilters
        instructors={instructors}
        lessonTypes={lessonTypes}
        selectedInstructors={filters.instructorIds}
        selectedLessonTypes={filters.lessonTypes}
        onInstructorChange={(ids) => setFilters(prev => ({ ...prev, instructorIds: ids }))}
        onLessonTypeChange={(types) => setFilters(prev => ({ ...prev, lessonTypes: types }))}
      />

      <ManagerCalendar 
        bookings={bookings} 
        availability={availability} 
        isLoading={isLoading}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
      />
    </div>
  );
}