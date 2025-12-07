import { createClient } from '@/lib/supabase/client';

export type Availability = {
  id: number;
  instructor_id: string;
  start_time: string;
  end_time: string;
  recurrence_rule: string | null;
};

export const AvailabilityService = {
  async getAvailability(instructorId: string, startDate: Date, endDate: Date): Promise<Availability[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('instructor_id', instructorId)
      .gte('start_time', startDate.toISOString())
      .lte('end_time', endDate.toISOString());

    if (error) {
      throw new Error(error.message);
    }

    return data as Availability[];
  },

  async createAvailability(data: { instructor_id: string; start_time: Date; end_time: Date; recurrence_rule?: string }): Promise<void> {
    const supabase = createClient();

    // Overlap check
    // We check if there are any slots that overlap with the new slot.
    // Two time ranges (StartA, EndA) and (StartB, EndB) overlap if StartA < EndB and EndA > StartB.
    const { data: overlapping, error: overlapError } = await supabase
      .from('availability')
      .select('id')
      .eq('instructor_id', data.instructor_id)
      .lt('start_time', data.end_time.toISOString())
      .gt('end_time', data.start_time.toISOString());
    
    if (overlapError) {
      throw new Error(overlapError.message);
    }

    if (overlapping && overlapping.length > 0) {
      throw new Error('Overlapping availability slot detected.');
    }

    const { error } = await supabase
      .from('availability')
      .insert({
        instructor_id: data.instructor_id,
        start_time: data.start_time.toISOString(),
        end_time: data.end_time.toISOString(),
        recurrence_rule: data.recurrence_rule || null,
      });

    if (error) {
      throw new Error(error.message);
    }
  },

  async deleteAvailability(id: number): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('availability')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },
};
