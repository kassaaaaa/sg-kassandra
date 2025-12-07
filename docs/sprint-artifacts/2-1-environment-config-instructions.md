# Supabase Environment Configuration Instructions for Story 2-1

## Secrets

To set the OpenWeatherMap API key, run the following Supabase CLI command:

```bash
supabase secrets set OPENWEATHERMAP_API_KEY="4e88a06255d6a0d8249bb29eb62d5ddd"
```

## Environment Variables

The school's coordinates should be set as environment variables.

```bash
# .env.local
NEXT_PUBLIC_SCHOOL_LAT="37.890177514472555"
NEXT_PUBLIC_SCHOOL_LON="12.469912047141326"
```

**Note:** Replace `"your_api_key_here"`, `"your_latitude_here"`, and `"your_longitude_here"` with the actual values.
