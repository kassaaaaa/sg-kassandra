import { createBrowserClient } from '@supabase/ssr';

export type Booking = {
  lesson_type_id: string;
  start_time: string;
  customer_info: {
    name: string;
    email: string;
    phone: string;
  };
};

export async function createBooking(booking: Booking) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.functions.invoke('create-booking', {
    body: JSON.stringify(booking),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
