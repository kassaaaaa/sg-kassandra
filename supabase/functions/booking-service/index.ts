import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.2';
import { corsHeaders } from '../_shared/cors.ts';
import { z } from 'https://deno.land/x/zod@v3.23.4/mod.ts';

const createSchema = z.object({
  customer_id: z.string().uuid(),
  instructor_id: z.string().uuid().nullable().optional(),
  lesson_id: z.number(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  location: z.string().optional(),
  manager_notes: z.string().optional(),
});

const updateSchema = z.object({
  id: z.number(),
  customer_id: z.string().uuid().optional(), // Allow changing customer
  instructor_id: z.string().uuid().nullable().optional(),
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional(),
  location: z.string().optional(),
  manager_notes: z.string().optional(),
  status: z.string().optional(),
  lesson_id: z.number().optional(), // Allow changing lesson type
});

const deleteSchema = z.object({
  id: z.number(),
});

export const bookingServiceHandler = async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify Manager Role
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) throw new Error('Unauthorized');

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'manager') {
      return new Response(JSON.stringify({ error: 'Forbidden: Managers only' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    const url = new URL(req.url);

    // Helper: Check for conflicts
    const checkForConflicts = async (client: any, instructorId: string, startTime: string, endTime: string, excludeId?: number) => {
        let query = client
            .from('bookings')
            .select('id')
            .eq('instructor_id', instructorId)
            .neq('status', 'cancelled')
            .or(`and(start_time.lt.${endTime},end_time.gt.${startTime})`);

        if (excludeId) {
            query = query.neq('id', excludeId);
        }

        const { data: conflicts, error } = await query;
        if (error) throw error;
        return conflicts && conflicts.length > 0;
    };

    // Helper: Send Notification Stub
    const sendNotification = async (type: 'CREATED' | 'UPDATED' | 'CANCELLED', booking: any) => {
        // Mock Notification Service Integration
        // In a real implementation, this would call the NotificationService API or insert into a queue.
        console.log(`[NotificationService Mock] Trigger: Booking ${type}`, {
            booking_id: booking.id,
            customer_id: booking.customer_id,
            instructor_id: booking.instructor_id,
            start_time: booking.start_time,
            type: type
        });
    };

    if (req.method === 'POST') {
        const body = await req.json();
        const data = createSchema.parse(body);

        // Conflict Detection
        if (data.instructor_id) {
             const hasConflict = await checkForConflicts(supabaseClient, data.instructor_id, data.start_time, data.end_time);
             if (hasConflict) {
                 console.warn(`Manager override: Double booking created for instructor ${data.instructor_id} at ${data.start_time}`);
             }
        }

        const bookingReference = `MAN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const { data: booking, error } = await supabaseClient
            .from('bookings')
            .insert({ 
                ...data, 
                status: 'confirmed',
                booking_reference: bookingReference
            })
            .select()
            .single();
        
        if (error) throw error;
        
        await sendNotification('CREATED', booking);

        return new Response(JSON.stringify(booking), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 201
        });
    } 
    
    else if (req.method === 'PUT') {
        const body = await req.json();
        const data = updateSchema.parse(body);
        
        // Fetch current booking for conflict check context
        const { data: currentBooking, error: fetchError } = await supabaseClient
            .from('bookings')
            .select('*')
            .eq('id', data.id)
            .single();
            
        if (fetchError || !currentBooking) {
            throw new Error('Booking not found');
        }

        // Determine effective values
        const effectiveInstructorId = data.instructor_id === undefined ? currentBooking.instructor_id : data.instructor_id;
        const effectiveStartTime = data.start_time || currentBooking.start_time;
        const effectiveEndTime = data.end_time || currentBooking.end_time;

        // Check conflicts if we have an instructor (might be null if unassigned)
        if (effectiveInstructorId) {
             const hasConflict = await checkForConflicts(
                 supabaseClient, 
                 effectiveInstructorId, 
                 effectiveStartTime, 
                 effectiveEndTime, 
                 data.id
             );
             
             if (hasConflict) {
                 console.warn(`Manager override: Double booking update for instructor ${effectiveInstructorId} at ${effectiveStartTime}`);
             }
        }
        
        const { data: booking, error } = await supabaseClient
            .from('bookings')
            .update(data)
            .eq('id', data.id)
            .select()
            .single();

         if (error) throw error;
         
         await sendNotification('UPDATED', booking);

         return new Response(JSON.stringify(booking), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        });
    }

    else if (req.method === 'DELETE') {
        // Soft delete (Cancel)
        let id: number | undefined;
        // Try body first
        try {
            const body = await req.json();
            const parsed = deleteSchema.safeParse(body);
            if (parsed.success) id = parsed.data.id;
        } catch (e) {
            // Ignore body parse error, try param
        }
        
        if (!id) {
             const idParam = url.searchParams.get('id');
             if (idParam) id = parseInt(idParam);
        }

        if (!id) throw new Error("Missing Booking ID");

        const { data: booking, error } = await supabaseClient
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        
         await sendNotification('CANCELLED', booking);

        return new Response(JSON.stringify({ success: true, booking }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        });
    }

    return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  } catch (error) {
    console.error('Booking Service Error:', error);
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.issues }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
};

serve(bookingServiceHandler);
