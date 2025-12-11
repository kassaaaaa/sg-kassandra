# Story 3.5: Manager Manual Booking Management

Status: ready-for-dev

## Story

As a Manager,
I want to manually add, edit, or cancel any booking,
so that I have full control over the schedule and can handle exceptions or offline bookings.

## Acceptance Criteria

1.  **Manual Booking Creation:** The system shall allow a Manager to manually create a new booking by specifying the customer, instructor, lesson type, date, and time. This bypasses the automated scheduling engine's suggestions. [Source: tech-spec-epic-3.md, FR025.a, FR026.a]
2.  **Booking Modification:** The system shall allow a Manager to edit an existing booking, including changing the time, location, or assigned instructor (reassignment). [Source: tech-spec-epic-3.md, FR025.b, FR026.d]
3.  **Booking Cancellation:** The system shall allow a Manager to cancel any existing booking, requiring a confirmation step. [Source: tech-spec-epic-3.md, FR025.c]
4.  **Instructor Override:** When manually creating or editing a booking, the Manager must be able to assign *any* instructor, effectively overriding automated load-balancing rules, though conflicts (double-booking) should still trigger a warning or prevention. [Source: tech-spec-epic-3.md, FR026]
5.  **Notification Triggers:** Any manual creation, modification, or cancellation of a booking must trigger the appropriate email/SMS notifications to the affected Customer and Instructor. [Source: tech-spec-epic-3.md, FR025.e]

## Tasks / Subtasks

- [ ] **Task 1: Implement Backend Booking Operations (Supabase) (AC: #1, #2, #3, #4, #5)**
  - [ ] Create or update Supabase Edge Functions (`booking-service` or similar) to expose endpoints for Manager CRUD operations:
    - `POST /edge/manager/bookings`
    - `PUT /edge/manager/bookings/:id`
    - `DELETE /edge/manager/bookings/:id`
  - [ ] Implement server-side validation for inputs, following patterns in `architecture.md`.
  - [ ] Implement conflict detection logic (warn or error on double-booking) (AC: #4).
  - [ ] Ensure RLS policies allow Managers to perform these operations.
  - [ ] Integrate with `NotificationService` to send alerts on successful changes (AC: #5).

- [ ] **Task 2: Create Booking Management UI Components (AC: #1, #2, #3)**
  - [ ] Create `AddBookingModal` component (as per wireframe `add-booking-modal`).
  - [ ] Create `EditBookingModal` (likely sharing logic/form with Add).
  - [ ] Create `CancelBookingModal` confirmation dialog.
  - [ ] Implement form state management (likely `react-hook-form` + `zod`).
  - [ ] Integrate `useSchoolData` to populate dropdowns for Instructors and Lesson Types.

- [ ] **Task 3: Integrate with Calendar and Dashboard (AC: #1, #2)**
  - [ ] Update `ManagerCalendar` to open `EditBookingModal` when clicking an existing booking.
  - [ ] Update `ManagerCalendar` to open `AddBookingModal` when clicking an empty slot or "Add Booking" button.
  - [ ] Update `ManagerDashboard` "Quick Actions" to link the "Add Booking" button to the modal.

- [ ] **Task 4: Frontend State & Data Fetching (AC: #1, #2, #3, #4, #5)**
  - [ ] Create `useBookingMutations` hook (using TanStack Query `useMutation`) to handle the API calls to Edge Functions.
  - [ ] Ensure successful mutations invalidate relevant queries (`manager-calendar`, `dashboard-stats`) to refresh the UI.

- [ ] **Task 5: Testing (AC: #1, #2, #3, #4, #5)**
  - [ ] **Unit Tests:**
    - [ ] Unit test `AddBookingModal` and `EditBookingModal` form logic with `react-hook-form`.
    - [ ] Unit test the `useBookingMutations` hook to ensure it calls the correct endpoints.
  - [ ] **Integration Tests:**
    - [ ] Test the `booking-service` Edge Function to validate conflict detection logic (AC: #4).
    - [ ] Test the `booking-service` Edge Function to ensure it correctly triggers the `NotificationService` (AC: #5).
  - [ ] **E2E Test (Playwright):**
    - [ ] Write a test covering the full lifecycle: Manager logs in, opens the Add Booking modal, fills the form, saves, verifies the booking appears on the calendar, edits the booking, and finally cancels it, verifying it is removed.

## Dev Notes

- **Architecture:** All backend logic in Edge Functions must adhere to the layered **Error Handling** and **Structured Logging** patterns defined in `architecture.md`. All date/time operations must be handled in the school's local time zone and stored in UTC.
- **Wireframe Reference:** See `manager-dashboard.html` for `add-booking-modal` structure and fields.
- **Edge Functions:** Logic should reside in `supabase/functions/booking-service/` (or similar).
- **Notifications:** Reuse the notification infrastructure created in Epic 4 (or stub it if not ready, though Epics order suggests generic foundation is done). *Correction*: Epic 4 is backlog. We might need to implement a basic notification trigger or placeholder within the Edge Function.
- **Conflict Checking:** Even manual overrides should probably warn about double-booking an instructor. Decide if it's a hard block or a soft warning. (PRD FR008 implies system should prevent conflicting entries).

### Project Structure Notes

- **Components:** `app/components/bookings/` for the new modals.
- **Hooks:** `app/lib/hooks/useBookingMutations.ts`.
- **Services:** `app/lib/booking-service.ts` (client-side wrapper for Edge Function calls).

### Learnings from Previous Story

**From Story 3.4 (Status: done)**

- **Data Fetching:** Reuse `useSchoolData` hook created in 3.4 for populating instructor/lesson type dropdowns. The `useManagerCalendar` hook can also be referenced for patterns on fetching manager-specific data.
- **Patterns:** Continue using TanStack Query for state management.
- **Architecture:** The "read-only" calendar from 3.4 needs to become interactive. We might need to lift some state or pass handlers down to `ManagerCalendar`.
- **Files Created in 3.4:** `app/(protected)/calendar/page.tsx`, `app/components/calendar/ManagerCalendar.tsx`, `app/components/calendar/CalendarFilters.tsx`, `app/lib/hooks/useManagerCalendar.ts`, `app/lib/hooks/useSchoolData.ts`, `supabase/migrations/20251211000000_add_lesson_types_to_school_settings.sql`.
- **Files to Modify:** `app/(protected)/calendar/page.tsx`, `app/components/calendar/ManagerCalendar.tsx`.

### References

- **PRD:** [Source: docs/fase-2-plan/PRD.md]
- **Epics:** Story 3.5 [Source: docs/fase-3-solution/epics.md]
- **Tech Spec:** Manual Booking Management [Source: docs/sprint-artifacts/tech-spec-epic-3.md]
- **Architecture:** General Guidance [Source: docs/fase-3-solution/architecture.md]
- **Wireframes:** `manager-dashboard.html` [Source: docs/wireframes/manager-dashboard.html]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/3-5-manager-manual-booking-management.context.xml`

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
