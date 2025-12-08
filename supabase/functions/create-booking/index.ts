import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { z } from 'https://deno.land/x/zod@v3.23.4/mod.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.2';

const bookingSchema = z.object({
  lesson_type_id: z.string().uuid(),
  start_time: z.string().datetime(),
  customer_info: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { lesson_type_id, start_time, customer_info } = bookingSchema.parse(body);

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // TODO: Invoke scheduling-engine to get an instructor_id

    // Upsert customer details
    const { data: customerData, error: customerError } = await supabaseAdmin
      .from('customer_details')
      .upsert({
        email: customer_info.email,
        full_name: customer_info.name,
        phone: customer_info.phone,
      }, { onConflict: 'email' })
      .select('id')
      .single();

    if (customerError) {
      throw new Error(`Failed to create customer: ${customerError.message}`);
    }
    const customer_id = customerData.id;

    // Create booking
    const { data: bookingData, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        customer_id: customer_id,
        lesson_id: lesson_type_id,
        start_time: start_time,
        status: 'pending_assignment', // Initially pending until instructor is assigned
      })
      .select('booking_reference')
      .single();
    
    if (bookingError) {
      throw new Error(`Failed to create booking: ${bookingError.message}`);
    }

    return new Response(JSON.stringify({ success: true, booking_reference: bookingData.booking_reference }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.issues }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
