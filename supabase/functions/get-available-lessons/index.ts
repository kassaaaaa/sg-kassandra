import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

const QuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  skill_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  lesson_type: z.string().optional(),
});

export async function handleRequest(req: Request) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    
    const query = QuerySchema.safeParse(params);

    if (!query.success) {
      return new Response(JSON.stringify({ error: query.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { date, skill_level, lesson_type } = query.data;

    // Define day range (UTC)
    const startOfDay = `${date}T00:00:00.000Z`;
    const endOfDay = `${date}T23:59:59.999Z`;

    // 1. Get Lessons
    let lessonQuery = supabase
      .from('lessons')
      .select('id, name, duration_minutes, price')
      .eq('active', true);

    if (lesson_type) {
      lessonQuery = lessonQuery.ilike('name', `%${lesson_type}%`);
    }

    const { data: lessons, error: lessonError } = await lessonQuery;
    if (lessonError) throw lessonError;

    if (!lessons || lessons.length === 0) {
      return new Response(JSON.stringify([]), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const lessonIds = lessons.map(l => l.id);

    // 2. Get Instructors who can teach these lessons
    const { data: instructorLessons, error: ilError } = await supabase
      .from('instructor_lesson_types')
      .select('instructor_id, lesson_id')
      .in('lesson_id', lessonIds);
    
    if (ilError) throw ilError;

    const eligibleInstructorIds = [...new Set(instructorLessons.map(il => il.instructor_id))];

    if (eligibleInstructorIds.length === 0) {
      return new Response(JSON.stringify([]), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 3. Get Availability
    const { data: availabilities, error: avError } = await supabase
      .from('availability')
      .select('instructor_id, start_time, end_time')
      .in('instructor_id', eligibleInstructorIds)
      .gte('end_time', startOfDay) 
      .lte('start_time', endOfDay);

    if (avError) throw avError;

    // 4. Get Bookings
    const { data: bookings, error: bkError } = await supabase
      .from('bookings')
      .select('instructor_id, start_time, end_time')
      .in('instructor_id', eligibleInstructorIds)
      .neq('status', 'cancelled')
      .gte('end_time', startOfDay)
      .lte('start_time', endOfDay);
      
    if (bkError) throw bkError;

    // 6. Calculate Slots
    const results: any[] = [];

    for (const lesson of lessons) {
      const durationMs = lesson.duration_minutes * 60 * 1000;
      const relevantInstructors = instructorLessons
        .filter(il => il.lesson_id === lesson.id)
        .map(il => il.instructor_id);

      const allSlots: any[] = [];

      for (const instrId of relevantInstructors) {
        const instrAvail = availabilities?.filter(a => a.instructor_id === instrId) || [];
        const instrBookings = bookings?.filter(b => b.instructor_id === instrId) || [];

        for (const avail of instrAvail) {
           let slotStart = new Date(Math.max(new Date(avail.start_time).getTime(), new Date(startOfDay).getTime()));
           const availEnd = new Date(Math.min(new Date(avail.end_time).getTime(), new Date(endOfDay).getTime()));

           while (slotStart.getTime() + durationMs <= availEnd.getTime()) {
             const slotEnd = new Date(slotStart.getTime() + durationMs);
             
             // Check collision
             const isBooked = instrBookings.some(b => {
               const bStart = new Date(b.start_time).getTime();
               const bEnd = new Date(b.end_time).getTime();
               return (slotStart.getTime() < bEnd && slotEnd.getTime() > bStart);
             });

             if (!isBooked) {
               allSlots.push({
                 start_time: slotStart.toISOString(),
                 end_time: slotEnd.toISOString(),
                 instructor_id: instrId
               });
             }

             // Step by 30 mins
             slotStart = new Date(slotStart.getTime() + 30 * 60000); 
           }
        }
      }

      // De-dupe slots by time and aggregate
      const uniqueTimes = new Map();
      
      allSlots.sort((a, b) => a.start_time.localeCompare(b.start_time));

      for (const s of allSlots) {
        const key = s.start_time;
        if (!uniqueTimes.has(key)) {
           uniqueTimes.set(key, {
             start_time: s.start_time,
             available_slots: 1, 
             lesson_id: lesson.id,
             lesson_name: lesson.name,
             price: lesson.price,
             duration: lesson.duration_minutes
           });
        } else {
           uniqueTimes.get(key).available_slots++;
        }
      }
      
      results.push(...Array.from(uniqueTimes.values()));
    }

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

serve(handleRequest);
