import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createManagerBooking, updateManagerBooking, cancelManagerBooking } from '../booking-service';
import { toast } from 'sonner';

export function useBookingMutations() {
  const queryClient = useQueryClient();

  const createBooking = useMutation({
    mutationFn: createManagerBooking,
    onSuccess: () => {
      toast.success('Booking created successfully');
      queryClient.invalidateQueries({ queryKey: ['manager-calendar'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => {
      toast.error(`Failed to create booking: ${error.message}`);
    },
  });

  const updateBooking = useMutation({
    mutationFn: updateManagerBooking,
    onSuccess: () => {
      toast.success('Booking updated successfully');
      queryClient.invalidateQueries({ queryKey: ['manager-calendar'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => {
      toast.error(`Failed to update booking: ${error.message}`);
    },
  });

  const cancelBooking = useMutation({
    mutationFn: cancelManagerBooking,
    onSuccess: () => {
      toast.success('Booking cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['manager-calendar'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => {
      toast.error(`Failed to cancel booking: ${error.message}`);
    },
  });

  return { createBooking, updateBooking, cancelBooking };
}
