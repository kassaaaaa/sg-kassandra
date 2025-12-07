'use client';

import { AvailabilityCalendar } from '@/components/calendar/AvailabilityCalendar';
import { useState } from 'react';
import { AvailabilityService } from '@/lib/availability-service';
import { AddAvailabilityDialog } from '@/components/calendar/AddAvailabilityDialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function CalendarPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Fetch current user
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      return user;
    }
  });

  // Fetch availability
  const { data: availability = [] } = useQuery({
    queryKey: ['availability', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      // Fetching a wide range for MVP (current year and next year)
      const start = new Date(new Date().getFullYear(), 0, 1); 
      const end = new Date(new Date().getFullYear() + 2, 0, 1); 
      return AvailabilityService.getAvailability(user.id, start, end);
    },
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
        await AvailabilityService.deleteAvailability(id);
    },
    onSuccess: () => {
        toast.success('Availability deleted');
        queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
    onError: (error) => {
        toast.error('Failed to delete: ' + error.message);
    }
  });

  const handleAddSlot = (date: Date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const handleDeleteSlot = (id: number) => {
    if (confirm('Are you sure you want to delete this slot?')) {
        deleteMutation.mutate(id);
    }
  };

  if (isUserLoading) return <div className="p-6">Loading user...</div>;
  if (!user) return <div className="p-6">Please log in.</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Availability</h1>
            <p className="text-muted-foreground">
                Manage your teaching schedule and recurrence rules.
            </p>
        </div>
        <button 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            onClick={() => handleAddSlot(new Date())}
        >
            Add Availability
        </button>
      </div>
      
      <AvailabilityCalendar 
        availability={availability}
        onAddSlot={handleAddSlot}
        onDeleteSlot={handleDeleteSlot}
      />

      <AddAvailabilityDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultDate={selectedDate}
        instructorId={user.id}
      />
    </div>
  );
}