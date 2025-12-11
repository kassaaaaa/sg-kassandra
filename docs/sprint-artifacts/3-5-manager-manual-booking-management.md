# Story 3.5: Manager Manual Booking Management

Status: drafted

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

- [ ] **Task 1: Implement Backend Booking Operations (Supabase)**
  - [ ] Create or update Supabase Edge Functions (`booking-service` or similar) to expose endpoints for Manager CRUD operations:
    - `POST /edge/manager/bookings`
    - `PUT /edge/manager/bookings/:id`
    - `DELETE /edge/manager/bookings/:id`
  - [ ] Implement server-side validation for inputs.
  - [ ] Implement conflict detection logic (warn or error on double-booking).
  - [ ] Ensure RLS policies allow Managers to perform these operations.
  - [ ] Integrate with `NotificationService` to send alerts on successful changes.

- [ ] **Task 2: Create Booking Management UI Components**
  - [ ] Create `AddBookingModal` component (as per wireframe `add-booking-modal`).
  - [ ] Create `EditBookingModal` (likely sharing logic/form with Add).
  - [ ] Create `CancelBookingModal` confirmation dialog.
  - [ ] Implement form state management (likely `react-hook-form` + `zod`).
  - [ ] Integrate `useSchoolData` to populate dropdowns for Instructors and Lesson Types.

- [ ] **Task 3: Integrate with Calendar and Dashboard**
  - [ ] Update `ManagerCalendar` to open `EditBookingModal` when clicking an existing booking.
  - [ ] Update `ManagerCalendar` to open `AddBookingModal` when clicking an empty slot or "Add Booking" button.
  - [ ] Update `ManagerDashboard` "Quick Actions" to link the "Add Booking" button to the modal.

- [ ] **Task 4: Frontend State & Data Fetching**
  - [ ] Create `useBookingMutations` hook (using TanStack Query `useMutation`) to handle the API calls to Edge Functions.
  - [ ] Ensure successful mutations invalidate relevant queries (`manager-calendar`, `dashboard-stats`) to refresh the UI.

- [ ] **Task 5: Testing**
  - [ ] Unit tests for `AddBookingModal` and `EditBookingModal` form logic.
  - [ ] E2E test (Playwright) covering the full lifecycle:
    - Manager logs in.
    - Opens Add Booking modal.
    - Fills form and saves.
    - Verifies booking appears on calendar.
    - Edits the booking.
    - Cancels the booking.

## Dev Notes

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

- **Data Fetching:** Reuse `useSchoolData` hook created in 3.4 for populating instructor/lesson type dropdowns.
- **Patterns:** Continue using TanStack Query for state management.
- **Architecture:** The "read-only" calendar from 3.4 needs to become interactive. We might need to lift some state or pass handlers down to `ManagerCalendar`.
- **Files to Modify:** `app/(protected)/calendar/page.tsx`, `app/components/calendar/ManagerCalendar.tsx`.

### References

- **Epics:** Story 3.5 [Source: docs/fase-3-solution/epics.md]
- **Tech Spec:** Manual Booking Management [Source: docs/sprint-artifacts/tech-spec-epic-3.md]
- **Wireframes:** `manager-dashboard.html` [Source: docs/wireframes/manager-dashboard.html]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
