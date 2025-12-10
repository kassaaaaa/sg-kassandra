# Story 3.1: Instructor Dashboard UI

Status: review

## Story

As an Instructor,
I want a dashboard that shows my upcoming lessons and current weather,
so that I can quickly prepare for my day.

## Acceptance Criteria

### Core Functional Requirements
1.  **Dashboard Access:** The dashboard shall be accessible at `(protected)/dashboard` for authenticated users with the 'Instructor' role.
2.  **Lesson Summary (Snapshot):** The dashboard shall display a "Today's Snapshot" widget summarizing:
    - Total scheduled lessons for today.
    - Pending bookings (count).
    - Hours available (if applicable/calculated).
3.  **Weather Widget:** A "Local Conditions" widget shall display current weather data (Temperature, Wind Speed, Direction, Condition Icon) fetched from the system's weather service (or cache).
4.  **Upcoming Lessons List:** A list of "My Upcoming Lessons" for today and tomorrow shall be displayed, showing:
    - Time
    - Student Name
    - Lesson Type
    - Status (e.g., Confirmed, Pending)
5.  **Quick Actions:** The dashboard shall provide quick action buttons/links to:
    - "View My Calendar"
    - "Manage My Availability"
    - "View My Students"
    - "Update My Profile"
6.  **Responsive Layout:** The layout shall match the `instructor-dashboard.html` wireframe and be fully responsive (stacking widgets on mobile).

### Additional Quality Criteria
7.  **Performance:** The dashboard data should load efficiently, adhering to NFR01 (< 3 seconds).
8.  **Data Freshness:** Dashboard data should be kept fresh using TanStack Query (e.g., re-fetch on window focus).

## Tasks / Subtasks

- [x] Create Dashboard Page and Layout (AC: #1, #6)
  - [x] Create `app/(protected)/dashboard/page.tsx`.
  - [x] Implement `DashboardLayout` (if not exists) or ensure `page.tsx` uses the main authenticated layout.
  - [x] Implement role checking (redirect if not instructor - though middleware should handle this, page should handle graceful degradation or specific manager view if shared path). *Note: Epic 3.2 is Manager Dashboard. If they share `/dashboard`, this page needs to render conditionally based on role.*
- [x] Implement "Today's Snapshot" Widget (AC: #2)
  - [x] Create `components/dashboard/SnapshotWidget.tsx`.
  - [x] Implement data fetching logic (Supabase query to count bookings for today).
- [x] Implement "Local Conditions" Widget (AC: #3)
  - [x] Create `components/dashboard/WeatherWidget.tsx`.
  - [x] Integrate with `weather-poller` edge function or `weather_cache` table via Supabase client.
- [x] Implement "Upcoming Lessons" Component (AC: #4)
  - [x] Create `components/dashboard/UpcomingLessons.tsx`.
  - [x] Implement Supabase query to fetch bookings for `instructor_id` where date is today or tomorrow, ordered by time.
- [x] Implement "Quick Actions" Component (AC: #5)
  - [x] Create `components/dashboard/QuickActions.tsx`.
  - [x] Link buttons to placeholder routes (or real routes if they exist from Epic 1/2).
- [x] Integrate Data Fetching with TanStack Query (AC: #7, #8)
  - [x] Create a custom hook `useInstructorDashboard` in `lib/hooks/useInstructorDashboard.ts` (or similar).
  - [x] Use `useQuery` to manage loading and error states.
- [x] Write Unit and Component Tests
  - [x] Test `SnapshotWidget` renders correct counts.
  - [x] Test `WeatherWidget` handles missing data gracefully.
  - [x] Test `UpcomingLessons` renders list correctly.
- [x] Write E2E Tests
  - [x] Verify Instructor can log in and see the dashboard.
  - [x] Verify all widgets are present.
  - [x] Verify responsiveness (mobile view).

## Dev Notes

### Learnings from Previous Story

**From Story 2.6 (Status: review)**

- **New Files Created:** `app/(auth)/booking/[token]/page.tsx`, `supabase/functions/get-booking-by-token`, `supabase/migrations/20251209140000_add_secure_token.sql`
- **Security:** Established pattern for secure data access using Edge Functions and RLS. For the dashboard, RLS on `bookings` table should naturally restrict data to the logged-in instructor, so direct client queries might be sufficient and more performant than a dedicated Edge Function for simple reads.
- **Testing:** E2E tests are critical. Follow the pattern in `tests/e2e/secure-booking-link.spec.ts` for dashboard E2E.
- **Bug Watch:** Be careful with column references in Supabase queries (learnings from `location` column bug). Verify schema against `architecture.md` or actual DB. [Source: docs/sprint-artifacts/2-6-view-booking-via-secure-link.md]

### Project Structure Notes

- **Route:** `app/(protected)/dashboard` is the correct location.
- **Shared Dashboard Path:** Since Managers also need a dashboard (Story 3.2), and the path is likely just `/dashboard` for UX, the `page.tsx` at `app/(protected)/dashboard/page.tsx` effectively becomes a "Dispatcher" or "Smart Container" that renders `InstructorDashboard` or `ManagerDashboard` based on the user's role.
    - *Decision:* For this story, implementing the *Instructor* view is the goal. We should structure it so `InstructorDashboard` is a standalone component imported by the main page.
- **Components:** Place dashboard-specific components in `app/components/dashboard/`.

### References

- **Wireframe:** `docs/wireframes/instructor-dashboard.html` - Primary design source.
- **PRD:** FR017 (Instructor Dashboard). [Source: docs/fase-2-plan/PRD.md]
- **Architecture:** TanStack Query for state, Supabase Auth/RLS. [Source: docs/fase-3-solution/architecture.md]
- **Epics:** Story 3.1 acceptance criteria. [Source: docs/fase-3-solution/epics.md]

## Change Log

- 2025-12-10: Story drafted by Bob (Scrum Master).
- 2025-12-10: Implementation completed by Amelia (Dev). Added `full_name` and `email` to `profiles` table via migration to support dashboard needs. Updated `app/.env.local` to point to local Supabase instance for robust development and testing.

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-1-instructor-dashboard-ui.context.xml

### Agent Model Used

Gemini-2.5-Flash

### Debug Log References

### Completion Notes List

- Implemented `InstructorDashboard` with sub-components: `SnapshotWidget`, `WeatherWidget`, `UpcomingLessons`, `QuickActions`.
- Created `useInstructorDashboard` hook leveraging TanStack Query for efficient data fetching.
- Added `app/app/(protected)/layout.tsx` to provide a common navigation shell for authenticated pages.
- **Schema Changes:** Created migration `20251210120000_update_profiles_and_bookings_rls.sql` to:
    - Add `full_name` and `email` columns to `profiles` table and updated trigger to populate them from `auth.users`.
    - Enable RLS on `bookings` allowing Instructors to view their own bookings.
    - Enable RLS on `profiles` allowing Instructors to view profiles of their students (via bookings join).
- **Configuration:** Updated `app/.env.local` to use the local Supabase instance (`http://127.0.0.1:54321`) to ensure migrations and schema changes are reflected during development and testing.
- Verified implementation with Unit Tests (`vitest`) and E2E Tests (`playwright`).

### File List

- `app/app/(protected)/dashboard/page.tsx`
- `app/app/(protected)/layout.tsx`
- `app/components/dashboard/InstructorDashboard.tsx`
- `app/components/dashboard/SnapshotWidget.tsx`
- `app/components/dashboard/WeatherWidget.tsx`
- `app/components/dashboard/UpcomingLessons.tsx`
- `app/components/dashboard/QuickActions.tsx`
- `app/lib/hooks/useInstructorDashboard.ts`
- `app/__tests__/dashboard/SnapshotWidget.test.tsx`
- `app/__tests__/dashboard/WeatherWidget.test.tsx`
- `app/__tests__/dashboard/UpcomingLessons.test.tsx`
- `tests/e2e/instructor-dashboard.spec.ts`
- `supabase/migrations/20251210120000_update_profiles_and_bookings_rls.sql`
- `supabase/migrations/20251210120500_reload_schema.sql`
- `app/.env.local`
