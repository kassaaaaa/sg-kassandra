---
id: "2-4"
epic_id: "2"
title: "Implement Intelligent Scheduling Engine"
type: "backend"
status: "draft"
created_at: "2025-12-09"
---

# User Story
**As a** System
**I want to** intelligently assign an available and qualified instructor to a new booking request, considering real-time weather conditions and current workload
**So that** lessons are scheduled safely, maximizing instructor utilization and ensuring fair distribution of work without manual intervention.

# Acceptance Criteria

### 1. Input Handling
- [ ] The engine accepts a payload containing: `lesson_type_id`, `start_time` (ISO 8601), and `end_time` (ISO 8601).
- [ ] Inputs are validated for format and logical consistency (e.g., start < end).

### 2. Weather Qualification Logic
- [ ] **7-Day Rule:** If the booking is > 7 days in the future, the weather check is skipped (assumed suitable).
- [ ] **Weather Check:** If within 7 days, the engine retrieves cached weather data for the requested slot.
- [ ] **Suitability:** The system compares forecast data (wind speed, direction) against the `school_settings` rules for the specific `lesson_type`.
- [ ] **Rejection:** If conditions are deemed "unsafe" or "unsuitable", the scheduling attempt is rejected with a specific `weather_unsuitable` error.

### 3. Instructor Filtering
- [ ] **Qualification:** Filters the pool of instructors to only those linked to the requested `lesson_type_id` in `instructor_lesson_types`.
- [ ] **Availability:** Further filters to exclude instructors who have:
    - An overlapping booking in the `bookings` table (status `confirmed` or `pending`).
    - A `blocked` entry in the `availability` table for the requested time.
    - No `available` entry covering the requested slot in the `availability` table.

### 4. Load Balancing & Assignment (Tie-Breaker)
- [ ] **Load Calculation:** For all remaining qualified and available instructors, calculate their "Daily Load" (count of confirmed/pending bookings for that specific calendar day).
    - *Critical:* "Day" must be determined using the **School's Local Time Zone** (configured in settings), not UTC.
- [ ] **Ranking Strategy:** Sort candidates by:
    1.  **Lowest Load:** Fewest bookings for the day.
    2.  **Earliest Finish:** Earliest end time of their last assigned lesson (to group free time).
    3.  **Alphabetical:** Deterministic fallback by name.
- [ ] **Assignment:** Select the top-ranked instructor and return their `instructor_id`.

### 5. Failure Handling
- [ ] Returns a clear error code if no instructors are available (`no_instructor_available`).
- [ ] Returns a clear error code if weather is the blocking factor (`weather_unsuitable`).

# Technical Notes
- **Architecture:** Implemented as a Supabase Edge Function (`scheduling-engine`).
- **Data Access:** Uses `supabase-js` client with Service Role key (server-side only) to query `profiles`, `bookings`, `availability`, and `weather_cache`.
- **Time Zones:** Use a library like `date-fns-tz` to handle School Time Zone conversions strictly. Do not rely on server system time.
- **Performance:** This function is on the critical path for booking. Logic must be optimized (e.g., single complex SQL query or efficient in-memory filtering of fetched datasets).
- **Reference:** See `docs/fase-3-solution/scheduling-logic.md` for detailed algorithms.
