'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { ManagerCalendar } from '@/components/calendar/ManagerCalendar';
import { CalendarFilters } from '@/components/calendar/CalendarFilters';
import { useManagerCalendar } from '@/lib/hooks/useManagerCalendar';
import { useInstructors, useLessonTypes } from '@/lib/hooks/useSchoolData';
import { AddBookingModal } from '@/components/bookings/AddBookingModal';
import { EditBookingModal } from '@/components/bookings/EditBookingModal';
import { format } from 'date-fns';
import { ManagerBooking } from '@/lib/hooks/useManagerDashboard';
import { useSearchParams } from 'next/navigation';

function CalendarContent() {
  const { 
    bookings, 
    availability, 
    isLoading, 
    currentDate, 
    setCurrentDate,
    filters,
    setFilters
  } = useManagerCalendar();

  const searchParams = useSearchParams();
  const action = searchParams.get('action');

  const { data: instructors = [] } = useInstructors();
  const { data: lessonTypes = [] } = useLessonTypes();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addDefaults, setAddDefaults] = useState<{date: string, time: string} | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<ManagerBooking | null>(null);

  useEffect(() => {
    if (action === 'new') {
        setIsAddOpen(true);
    }
  }, [action]);

  const handleAddBooking = (date: Date, timeStr: string) => {
    setAddDefaults({
        date: format(date, 'yyyy-MM-dd'),
        time: timeStr
    });
    setIsAddOpen(true);
  };

  const handleEditBooking = (booking: ManagerBooking) => {
    setSelectedBooking(booking);
    setIsEditOpen(true);
  };

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
        onAddBooking={handleAddBooking}
        onEditBooking={handleEditBooking}
      />

      <AddBookingModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        defaultDate={addDefaults?.date}
        defaultTime={addDefaults?.time}
      />

      <EditBookingModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        booking={selectedBooking ? {
            id: selectedBooking.id,
            customer_id: selectedBooking.customer_id || '',
            instructor_id: selectedBooking.instructor_id,
            lesson_id: selectedBooking.lesson_id,
            start_time: selectedBooking.start_time,
            end_time: selectedBooking.end_time,
            manager_notes: selectedBooking.manager_notes,
        } : null}
      />
    </div>
  );
}

export default function ManagerCalendarPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-6">Loading calendar...</div>}>
      <CalendarContent />
    </Suspense>
  );
}