import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Hello from manager-settings!")

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Check auth/role - although RLS handles it at DB level, we might want early exit
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
    }

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('school_settings')
        .select('*')
        .maybeSingle(); // Use maybeSingle to handle empty table gracefully if RLS permits but empty

      if (error) throw error;
      
      // If empty, return default structure (or handle in client)
      // Migration inserted a row, so it should exist.
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (req.method === 'PUT') {
      const body = await req.json();
      
      // Server-side Validation
      const { weather_api_thresholds } = body;
      if (weather_api_thresholds) {
        const min = Number(weather_api_thresholds.min_wind_speed);
        const max = Number(weather_api_thresholds.max_wind_speed);
        
        if (min < 0 || max < 0) {
           return new Response(JSON.stringify({ error: 'Wind speeds must be positive' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        if (min > max) {
          return new Response(JSON.stringify({ error: 'Minimum wind speed cannot be greater than maximum wind speed' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      // We assume singleton row with id=1
      const { error } = await supabase
        .from('school_settings')
        .update(body)
        .eq('id', 1);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
