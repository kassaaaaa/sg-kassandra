// supabase/functions/weather-poller/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

const OPENWEATHERMAP_API_KEY = Deno.env.get("OPENWEATHERMAP_API_KEY");
const SCHOOL_LAT = Deno.env.get("SCHOOL_LAT") || "YOUR_LATITUDE";
const SCHOOL_LON = Deno.env.get("SCHOOL_LON") || "YOUR_LONGITUDE";

const WeatherResponseSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  timezone: z.string(),
  timezone_offset: z.number(),
  current: z.object({
    dt: z.number(),
    sunrise: z.number(),
    sunset: z.number(),
    temp: z.number(),
    feels_like: z.number(),
    pressure: z.number(),
    humidity: z.number(),
    dew_point: z.number(),
    uvi: z.number(),
    clouds: z.number(),
    visibility: z.number(),
    wind_speed: z.number(),
    wind_deg: z.number(),
    wind_gust: z.number().optional(),
    weather: z.array(z.object({
      id: z.number(),
      main: z.string(),
      description: z.string(),
      icon: z.string(),
    })),
  }),
});

async function fetchWeather(lat: string, lon: string) {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }
  const data = await response.json();
  return WeatherResponseSchema.parse(data);
}

export async function handleRequest(req: Request, supabaseClient: any) {
  // 1. Attempt to retrieve the most recent cache entry
  const { data: cachedData, error: cacheError } = await supabaseClient
    .from("weather_cache")
    .select("data, created_at")
    .eq("location", "main_beach")
    .order("created_at", { ascending: false })
    .limit(1);

  if (cacheError) {
    console.error("Error fetching from cache:", cacheError);
    // Don't return; proceed to API fetch as a fallback
  }

  const cachedEntry = cachedData && cachedData.length > 0 ? cachedData[0] : null;

  // 2. Check if the cache is fresh enough
  if (cachedEntry) {
    const cacheAgeMs = Date.now() - new Date(cachedEntry.created_at).getTime();
    const ONE_HOUR_MS = 3600000;
    if (cacheAgeMs < ONE_HOUR_MS) {
      return new Response(JSON.stringify(cachedEntry.data), {
        headers: { "Content-Type": "application/json", "X-Cache-Status": "hit" },
      });
    }
  }

  // 3. Cache is stale or missing, so fetch from the external API
  try {
    const weatherData = await fetchWeather(SCHOOL_LAT, SCHOOL_LON);

    // Insert into cache; await to ensure execution before runtime termination
    const { error: insertError } = await supabaseClient
      .from("weather_cache")
      .insert({ location: "main_beach", data: weatherData });

    if (insertError) {
      console.error("Error inserting into cache:", insertError);
    }

    return new Response(JSON.stringify(weatherData), {
      headers: { "Content-Type": "application/json", "X-Cache-Status": "miss" },
    });
  } catch (apiError: unknown) {
    const errorMessage = (apiError as Error).message;
    console.error(`External API fetch failed: ${errorMessage}`);

    // 4. API failed, so fallback to the stale cache if it exists
    if (cachedEntry) {
      console.log("API fetch failed. Returning stale cache as fallback.");
      return new Response(JSON.stringify(cachedEntry.data), {
        headers: { "Content-Type": "application/json", "X-Cache-Status": "stale" },
      });
    }

    // 5. API failed and there's no cache at all, return a server error
    return new Response(JSON.stringify({ error: "Failed to fetch weather data and no cache is available." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Only run the server when the script is executed directly
if (import.meta.main) {
  serve(async (req) => {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    return handleRequest(req, supabaseClient);
  });
}
