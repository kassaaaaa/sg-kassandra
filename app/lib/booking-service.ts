import { createBrowserClient } from '@supabase/ssr';

export type Booking = {
  lesson_id: number;
  lesson_name: string;
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
    // Check if the response body contains a specific error message
    // The supabase.functions.invoke might wrap the error, so we try to extract useful info
    try {
      if (error instanceof Error) {
         throw new Error(error.message);
      }
      const errorBody = typeof error === 'object' && error !== null && 'context' in error 
        ? await (error as any).context.json() 
        : error;
        
       if (errorBody && errorBody.error) {
           throw new Error(JSON.stringify(errorBody.error));
       }
    } catch (e) {
        // Fallback if JSON parsing fails
        throw new Error(error.message || "Unknown Edge Function Error");
    }
    throw new Error(error.message || "Unknown Edge Function Error");
  }

  return data;
}

export async function getBookingByToken(token: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.functions.invoke('get-booking-by-token', {
    body: JSON.stringify({ token }),
  });

  if (error) {
    try {
      if (typeof error === 'object' && error !== null && 'context' in error) {
         const errorBody = await (error as any).context.json();
         if (errorBody && errorBody.error) {
             const msg = typeof errorBody.error === 'string' ? errorBody.error : JSON.stringify(errorBody.error);
             throw new Error(msg);
         }
      }

      if (error instanceof Error) {
         throw new Error(error.message);
      }
    } catch (e) {
        if (e instanceof Error && e.message !== "Unknown Edge Function Error") throw e;
        throw new Error(error.message || "Unknown Edge Function Error");
    }
    throw new Error(error.message || "Unknown Edge Function Error");
  }

  return data;
}
