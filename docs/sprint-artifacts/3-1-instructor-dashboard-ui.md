# Story 3.1: Instructor Dashboard UI

Status: drafted

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

- [ ] Create Dashboard Page and Layout (AC: #1, #6)
  - [ ] Create `app/(protected)/dashboard/page.tsx`.
  - [ ] Implement `DashboardLayout` (if not exists) or ensure `page.tsx` uses the main authenticated layout.
  - [ ] Implement role checking (redirect if not instructor - though middleware should handle this, page should handle graceful degradation or specific manager view if shared path). *Note: Epic 3.2 is Manager Dashboard. If they share `/dashboard`, this page needs to render conditionally based on role.*
- [ ] Implement "Today's Snapshot" Widget (AC: #2)
  - [ ] Create `components/dashboard/SnapshotWidget.tsx`.
  - [ ] Implement data fetching logic (Supabase query to count bookings for today).
- [ ] Implement "Local Conditions" Widget (AC: #3)
  - [ ] Create `components/dashboard/WeatherWidget.tsx`.
  - [ ] Integrate with `weather-poller` edge function or `weather_cache` table via Supabase client.
- [ ] Implement "Upcoming Lessons" Component (AC: #4)
  - [ ] Create `components/dashboard/UpcomingLessons.tsx`.
  - [ ] Implement Supabase query to fetch bookings for `instructor_id` where date is today or tomorrow, ordered by time.
- [ ] Implement "Quick Actions" Component (AC: #5)
  - [ ] Create `components/dashboard/QuickActions.tsx`.
  - [ ] Link buttons to placeholder routes (or real routes if they exist from Epic 1/2).
- [ ] Integrate Data Fetching with TanStack Query (AC: #7, #8)
  - [ ] Create a custom hook `useInstructorDashboard` in `lib/hooks/useInstructorDashboard.ts` (or similar).
  - [ ] Use `useQuery` to manage loading and error states.
- [ ] Write Unit and Component Tests
  - [ ] Test `SnapshotWidget` renders correct counts.
  - [ ] Test `WeatherWidget` handles missing data gracefully.
  - [ ] Test `UpcomingLessons` renders list correctly.
- [ ] Write E2E Tests
  - [ ] Verify Instructor can log in and see the dashboard.
  - [ ] Verify all widgets are present.
  - [ ] Verify responsiveness (mobile view).

## Dev Notes

### Learnings from Previous Story

**From Story 2.6 (Status: review)**

- **New Files Created:** `app/(auth)/booking/[token]/page.tsx`, `supabase/functions/get-booking-by-token`, `supabase/migrations/20251209140000_add_secure_token.sql`
- **Security:** Established pattern for secure data access using Edge Functions and RLS. For the dashboard, RLS on `bookings` table should naturally restrict data to the logged-in instructor, so direct client queries might be sufficient and more performant than a dedicated Edge Function for simple reads.
- **Testing:** E2E tests are critical. Follow the pattern in `tests/e2e/secure-booking-link.spec.ts` for dashboard E2E.
- **Bug Watch:** Be careful with column references in Supabase queries (learnings from `location` column bug). Verify schema against `architecture.md` or actual DB.

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

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Gemini-2.5-Flash

### Debug Log References

### Completion Notes List

### File List
