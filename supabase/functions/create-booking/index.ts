import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { z } from 'https://deno.land/x/zod@v3.23.4/mod.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.2';

const bookingSchema = z.object({
  lesson_id: z.number(),
  // lesson_name is not needed for logic, we fetch it from DB to verify
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
    const { lesson_id, start_time, customer_info } = bookingSchema.parse(body);

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Fetch Lesson Details (Duration)
    const { data: lesson, error: lessonError } = await supabaseAdmin
      .from('lessons')
      .select('duration_minutes')
      .eq('id', lesson_id)
      .single();

    if (lessonError || !lesson) {
      throw new Error(`Invalid lesson_id: ${lessonError?.message || 'Not found'}`);
    }

    // 2. Calculate End Time
    const startDate = new Date(start_time);
    const endDate = new Date(startDate.getTime() + lesson.duration_minutes * 60 * 1000);

    // 3. Call Intelligent Scheduling Engine
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const internalSecret = Deno.env.get('INTERNAL_SERVICE_KEY') || 'dev-secret';
    const schedulingEngineUrl = `${supabaseUrl}/functions/v1/scheduling-engine`;

    const schedulingResponse = await fetch(schedulingEngineUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-internal-secret': internalSecret,
        },
        body: JSON.stringify({
            lesson_type_id: lesson_id,
            start_time: start_time,
            end_time: endDate.toISOString(),
        }),
    });

    if (!schedulingResponse.ok) {
        const errorData = await schedulingResponse.json();
        throw new Error(`Scheduling failed: ${errorData.message || errorData.error}`);
    }

    const schedulingResult = await schedulingResponse.json();
    const instructorId = schedulingResult.data.instructor_id;

    // 4. Create Booking (Guest)
    const { data: bookingData, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        lesson_id: lesson_id,
        instructor_id: instructorId,
        start_time: start_time,
        end_time: endDate.toISOString(),
        status: 'confirmed',
        guest_name: customer_info.name,
        guest_email: customer_info.email,
        guest_phone: customer_info.phone,
        // customer_id is null for guests
      })
      .select('id')
      .single();
    
    if (bookingError) {
      throw new Error(`Failed to create booking: ${bookingError.message}`);
    }

    return new Response(JSON.stringify({ success: true, booking_id: bookingData.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Booking Error:', error);
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.issues }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400, // Return 400 to show message in frontend, or 500
    });
  }
});