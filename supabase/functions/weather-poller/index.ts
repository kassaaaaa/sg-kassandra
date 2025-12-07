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
  try {
    const { data: cachedData, error: cacheError } = await supabaseClient
      .from("weather_cache")
      .select("data, created_at")
      .eq("location", "main_beach")
      .order("created_at", { ascending: false })
      .limit(1);

    if (cacheError) {
      console.error("Error fetching from cache:", cacheError);
      // Allow fallback to API fetch even if cache read fails
    }

    if (cachedData && cachedData.length > 0) {
      const cacheAge = Date.now() - new Date(cachedData[0].created_at).getTime();
      if (cacheAge < 3600000) { // 1 hour in milliseconds
        return new Response(JSON.stringify(cachedData[0].data), {
          headers: { "Content-Type": "application/json", "X-Cache-Status": "hit" },
        });
      }
    }

    // Cache is stale or doesn't exist, attempt to fetch fresh data
    try {
      const weatherData = await fetchWeather(SCHOOL_LAT, SCHOOL_LON);

      const { error: insertError } = await supabaseClient
        .from("weather_cache")
        .insert({
          location: "main_beach",
          data: weatherData,
        });

      if (insertError) {
        // Log error but still return fresh data to the client
        console.error("Error inserting into cache:", insertError);
      }

      return new Response(JSON.stringify(weatherData), {
        headers: { "Content-Type": "application/json", "X-Cache-Status": "miss" },
      });
    } catch (fetchError: unknown) {
      console.error("Failed to fetch new weather data:", (fetchError as Error).message);
      if (cachedData && cachedData.length > 0) {
        console.log("Returning stale cache as fallback.");
        return new Response(JSON.stringify(cachedData[0].data), {
          headers: { "Content-Type": "application/json", "X-Cache-Status": "stale" },
        });
      }
      // If fetch fails and there's no cached data, re-throw to outer catch
      throw new Error("Failed to fetch new weather data and no cache is available.");
    }
  } catch (error: unknown) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
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
