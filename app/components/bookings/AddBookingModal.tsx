'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ManagerBookingForm, ManagerBookingFormValues } from './ManagerBookingForm';
import { useBookingMutations } from '@/lib/hooks/useBookingMutations';

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultTime?: string;
  defaultInstructorId?: string;
}

export function AddBookingModal({ isOpen, onClose, defaultDate, defaultTime, defaultInstructorId }: AddBookingModalProps) {
  const { createBooking } = useBookingMutations();
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (values: ManagerBookingFormValues) => {
    // Combine date and time to ISO strings
    const startDateTime = new Date(`${values.date}T${values.start_time}:00`);
    const endDateTime = new Date(`${values.date}T${values.end_time}:00`);

    const bookingData = {
      customer_id: values.customer_id,
      instructor_id: values.instructor_id === 'unassigned' ? null : values.instructor_id,
      lesson_id: parseInt(values.lesson_id),
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      manager_notes: values.manager_notes,
    };

    createBooking.mutate(bookingData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Booking</DialogTitle>
          <DialogDescription>
            Manually create a booking for a customer.
          </DialogDescription>
        </DialogHeader>
        <ManagerBookingForm 
            onSubmit={handleSubmit} 
            isLoading={createBooking.isPending} 
            defaultValues={{
                date: defaultDate || today,
                start_time: defaultTime || '09:00',
                instructor_id: defaultInstructorId,
            }}
        />
      </DialogContent>
    </Dialog>
  );
}
