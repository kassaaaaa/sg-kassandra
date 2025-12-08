import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { calculateSlots } from "./logic.ts";
import { checkRateLimit } from "../_shared/rate-limiter.ts";

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

    // Rate Limiting
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    const { allowed } = await checkRateLimit(supabase, `ip:${clientIp}`, 60, 60); // 60 reqs per 60s
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Too Many Requests' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
    const results = calculateSlots(
      lessons, 
      instructorLessons, 
      availabilities || [], 
      bookings || [], 
      startOfDay, 
      endOfDay
    );

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
