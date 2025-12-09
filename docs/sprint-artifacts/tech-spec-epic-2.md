# Epic Technical Specification: Customer Booking and Core Scheduling

Date: Sunday, December 7, 2025
Author: BIP
Epic ID: 2
Status: Draft

---

## Overview

This epic focuses on implementing the core value proposition of KiteOps: the ability for customers to easily book lessons that are intelligently scheduled based on weather and instructor availability. It encompasses the end-to-end booking flow for guests, the integration of the OpenWeatherMap API, and the initial version of the "Intelligent Scheduling Engine". This epic bridges the foundation built in Epic 1 with the operational workflows to be expanded in Epic 3.

## Objectives and Scope

### In-Scope
*   **Weather API Integration:** Implementing `weather-poller` Edge Function and caching mechanism (Story 2.1).
*   **Lesson Search & Filter:** Public-facing UI for finding lessons (Story 2.2).
*   **Guest Booking Flow:** Single-page booking modal with contact info and policy acceptance (Story 2.3).
*   **Intelligent Scheduling Engine:** Serverless logic to assign instructors based on availability, weather, and load balancing (Story 2.4).
*   **Booking Confirmation:** Summary display and reference number generation (Story 2.5).
*   **Secure Booking Access:** View-only page for guests accessed via secure token link (Story 2.6).
*   **Multi-Session Support:** Handling linked bookings for courses/clinics (Story 2.7).
*   **Security:** CAPTCHA implementation on booking form (Story 2.8).

### Out-of-Scope
*   **Payments:** Full payment gateway integration (deferred to future release).
*   **Manager Oversight:** Manual override of scheduling, manager dashboards (Epic 3).
*   **Advanced Notifications:** System-wide notification framework (Epic 4), though basic confirmation emails are implied dependencies.
*   **Complex Rebooking:** Automated rebooking workflows for bad weather (Epic 3/4).

## System Architecture Alignment

This implementation strictly adheres to the architecture defined in `architecture.md`:
*   **Frontend:** Next.js 14+ App Router with Tailwind CSS and `shadcn/ui` components.
*   **Backend Logic:** Supabase Edge Functions for the `weather-poller` and `scheduling-engine` to ensure scalability and isolation of complex logic.
*   **Data Persistence:** Supabase PostgreSQL with RLS policies ensuring data security.
*   **State Management:** TanStack Query for server state (availability, lessons) and React Hook Form for booking inputs.
*   **External Integration:** OpenWeatherMap API via Edge Functions (Cache-first strategy).

## Detailed Design

### Services and Modules

| Module/Service | Type | Responsibility | Owner |
| :--- | :--- | :--- | :--- |
| `weather-poller` | Edge Function | Fetch weather data from OpenWeatherMap, cache in DB, serve cached data. | Backend |
| `scheduling-engine` | Edge Function | Analyze availability, weather, and load; assign instructor to booking. | Backend |
| `BookingForm` | React Component | Handle user input, validation (Zod), CAPTCHA, and submission. | Frontend |
| `LessonSearch` | React Component | Filter and display `LessonCard` list based on criteria. | Frontend |
| `BookingService` | Lib/Service | Client-side abstraction for booking API calls. | Frontend |

### Data Models and Contracts

**New Tables / Updates:**

*   **`bookings`**
    *   `id` (UUID, PK)
    *   `customer_id` (UUID, FK to `customer_details` or `auth.users`)
    *   `lesson_id` (UUID, FK)
    *   `instructor_id` (UUID, FK, Nullable initially)
    *   `start_time` (TIMESTAMPTZ)
    *   `end_time` (TIMESTAMPTZ)
    *   `status` (Enum: `pending_weather`, `pending_assignment`, `confirmed`, `cancelled_weather`, `cancelled_user`, `completed`)
    *   `booking_reference` (String, Unique)
    *   `parent_booking_id` (UUID, Self-ref FK for multi-session)
    *   `weather_snapshot` (JSONB, Weather data at time of booking)

*   **`weather_cache`**
    *   `id` (BigInt, PK)
    *   `location` (String/JSON)
    *   `forecast_time` (TIMESTAMPTZ)
    *   `data` (JSONB - raw API response subset)
    *   `created_at` (TIMESTAMPTZ)

*   **`customer_details`** (if not created in Epic 1)
    *   `id` (UUID, PK)
    *   `email` (String)
    *   `full_name` (String)
    *   `phone` (String)

### APIs and Interfaces

**Edge Function: `create-booking`**
*   **Method:** POST
*   **Body:** `{ lesson_type_id, start_time, customer_info: { name, email, phone }, captcha_token }`
*   **Response:** `{ success: true, booking_reference: "REF-123", status: "confirmed" }`
*   **Logic:**
    1.  Validate CAPTCHA.
    2.  Create `customer_details` record if new.
    3.  Invoke `scheduling-engine`.
    4.  Create `bookings` record.
    5.  Trigger confirmation (email/SMS - dependency on Epic 4 service or inline for now).

**Edge Function: `get-available-lessons`**
*   **Method:** GET
*   **Query Params:** `date`, `skill_level`, `lesson_type`
*   **Response:** `[{ lesson_id, start_time, available_slots }]`

### Workflows and Sequencing

**Booking Flow (Happy Path):**
1.  **User** submits search criteria on Landing Page.
2.  **Frontend** queries `get-available-lessons` (which checks `availability` table and `weather_cache`).
3.  **User** selects slot, fills "Guest Booking Modal", clicks "Book".
4.  **Frontend** sends POST to `create-booking`.
5.  **Edge Function** verifies CAPTCHA.
6.  **Edge Function** calls `scheduling-engine`:
    *   Check Weather (via `weather-poller`).
    *   Check Instructor Availability.
    *   Apply Load Balancing (Tie-breaker).
    *   Return Assigned Instructor ID.
7.  **Edge Function** writes to DB (`bookings`, `customer_details`).
8.  **Frontend** receives success, displays Confirmation Screen with Ref #.

### Key Algorithms

**Instructor Load Balancing Strategy:**
(Aligned with `docs/fase-3-solution/scheduling-logic.md`)
1.  **Filter:** Identify all instructors who are available and qualified for the lesson level.
2.  **Load Calculation:** Count confirmed and pending bookings for each candidate for the specific date (calculated in **School's Time Zone**).
3.  **Selection (Least-Loaded):** Select the instructor with the minimum booking count.
4.  **Tie-Breakers (in order):**
    *   **Earliest Finishing Lesson:** Prioritize instructors who finish their currently assigned lessons earliest.
    *   **Alphabetical:** If still tied, sort alphabetically by name (deterministic fallback).

## Non-Functional Requirements

### Performance
*   **Lesson Search:** Results load < 1s.
*   **Booking Submission:** Confirmation displayed < 2s (NFR01).
*   **Weather Cache:** Cache hit ratio > 90% to minimize API latency.

### Security
*   **Input Validation:** Strict Zod validation on all form inputs.
*   **CAPTCHA:** Google reCAPTCHA v3 (or similar) on booking endpoint (FR033).
*   **Access Control:** `bookings` table RLS - Guests can only insert; cannot read others' bookings. View access via secure token only.
*   **Secrets:** API Keys (OpenWeatherMap, Captcha) stored in Supabase Vault/Secrets.

### Reliability/Availability
*   **Weather Fallback:** Graceful handling of Weather API failure (use cached or default "fair" weather with warning) (FR030).
*   **Transaction Safety:** Booking creation and slot reservation must be atomic to prevent double-booking.

### Observability
*   **Logging:** All Edge Function executions logged in Supabase.
*   **Booking Logs:** Significant status changes (`confirmed` -> `cancelled`) logged with timestamp and actor.

## Dependencies and Integrations

*   **OpenWeatherMap API:** Current One Call API 3.0 (Account created, API Key secured).
*   **Twilio / Resend:** (Dependencies from Epic 4 for notifications, but required for Story 2.6 confirmation email).
*   **Google reCAPTCHA:** v3 (Account and keys required).
*   **Supabase:**
    *   **Edge Functions:** Deno runtime (latest).
    *   **Client SDK (`@supabase/supabase-js`):** ^2.86.0.
    *   **SSR (`@supabase/ssr`):** ^0.8.0.
*   **Frontend Frameworks:**
    *   **Next.js:** 16.0.7 (App Router).
    *   **React:** 19.2.0.
    *   **TanStack Query:** ^5.90.12.
    *   **React Hook Form:** ^7.68.0.
    *   **Zod:** ^4.1.13.
*   **UI Components:**
    *   **`shadcn/ui`:** Components (Modal, Card, Form, Calendar) via Radix primitives (latest compatible).
    *   **Tailwind CSS:** v4.

## Acceptance Criteria (Authoritative)

**Story 2.1: Weather API**
1.  `weather-poller` function deployed.
2.  Fetches data from OpenWeatherMap for school location.
3.  Caches results in Supabase `weather_cache`.
4.  Returns cached data if request is within cache duration (e.g., 1 hour).

**Story 2.2: Search UI**
1.  User can filter by Date, Skill, Lesson Type.
2.  Results update asynchronously.
3.  Displays "No lessons available" clearly if empty.

**Story 2.3: Guest Booking**
1.  Modal opens on slot selection.
2.  Collects Name, Email, Phone.
3.  "I accept policies" checkbox is mandatory.
4.  Submits data to backend.

**Story 2.4: Scheduling Engine**
1.  Input: Lesson time, type.
2.  Logic: Filter instructors by availability & skill match.
3.  Logic: Filter by weather suitability (wind range).
4.  Logic: If multiple instructors, apply load balancing (lowest load first, or random deterministic).
5.  Output: Assigned `instructor_id`.

**Story 2.5: Confirmation**
1.  UI displays "Booking Confirmed".
2.  Shows Booking Reference (e.g., "KO-2025-883").
3.  Shows Summary: Date, Time, Instructor (First Name), Location.

**Story 2.6: Secure Link**
1.  Endpoint `(auth)/booking/[token]` renders booking details.
2.  Token validation ensures access only to that specific booking.
3.  Link is included in confirmation email (mock/log if Email service not ready).

**Story 2.8: CAPTCHA**
1.  Booking request fails if CAPTCHA token missing/invalid.
2.  Legitimate users experience minimal friction (v3 invisible).

## Traceability Mapping

| Acceptance Criteria | Spec Section | Component / API | Test Idea |
| :--- | :--- | :--- | :--- |
| Story 2.1 - AC 3 (Caching) | Services/Modules | `weather-poller` | Unit: Mock API, call twice, ensure 1 outbound call. |
| Story 2.4 - AC 3 (Weather) | Workflows | `scheduling-engine` | Integration: Simulate high wind, ensure booking rejected/flagged. |
| Story 2.4 - AC 4 (Load Balance) | Workflows | `scheduling-engine` | Unit: 2 Instructors available, 1 has 0 bookings, 1 has 5. Ensure 0 assigned. |
| Story 2.6 - AC 2 (Token) | Security | `(auth)/booking/[token]` | E2E: Visit link with modified token, expect 403/404. |
| Story 2.8 - AC 1 (Captcha) | Security | `create-booking` | E2E: Submit payload without token, expect 400. |

## Risks, Assumptions, Open Questions

*   **Risk:** Weather API rate limits might be hit during high traffic.
    *   *Mitigation:* Aggressive caching and client-side throttle.
*   **Assumption:** Epic 4 Notification Service is available or we stub it out for Epic 2.
    *   *Decision:* Stub out via logging if Epic 4 service not ready, but prioritize Epic 4 basic setup if possible.
*   **Question:** Do we need to handle "Group Lessons" where multiple strangers book the same slot?
    *   *Answer:* PRD implies individual or private group. Multi-student scheduling is complex. Assuming 1 Booking = 1 Slot capacity for MVP unless specified otherwise.

## Test Strategy Summary

*   **Unit Testing:** Heavy focus on `scheduling-engine` logic (pure functions for load balancing and weather checks).
*   **Integration Testing:** Verify Edge Functions interact correctly with Supabase DB (RLS checks, Inserts).
*   **E2E Testing:** Critical path: Search -> Book -> Confirm. Verify CAPTCHA integration.
*   **Mocking:** Weather API must be mocked in all automated tests to ensure determinism.

## Post-Review Follow-ups

- [x] [Medium] Story 2.1: Await the cache insertion promise in `weather-poller` to ensure execution before runtime termination (AC #3).
- [x] [Low] Story 2.2: Add unit tests for `get-available-lessons` slot calculation logic to ensure robustness against edge cases (e.g., lessons spanning midnight, complex overlaps).
- [x] [Low] Story 2.2: Consider implementing rate limiting on the `get-available-lessons` Edge Function.
- [x] [Low] Story 2.2: Update "Expert Instructor" label in `LessonCard` to be dynamic or more generic ("Certified Instructor") if assignment happens later.
- [ ] [Low] Story 2.4: Update `fetchSchoolSettings` in `scheduling-engine` to fetch from DB when `school_settings` table is implemented.
- [x] [Low] Story 2.4: Ensure `timezone` setting is configurable (currently hardcoded to "UTC" in mock) in `scheduling-engine`.
- [ ] [Low] Story 2.5: `BookingSuccess.tsx` uses a default value for Location ("Sandy Point Beach"). Ensure this is updated if multiple locations are introduced in the future.
