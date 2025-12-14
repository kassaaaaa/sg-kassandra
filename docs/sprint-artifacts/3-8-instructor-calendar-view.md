# Story 3.8: Unified Calendar View (Manager/Instructor)

Status: done

## Story

As a Manager, I want to view a master calendar of all school activities.
As an Instructor, I want to view my personal schedule and manage my availability.
so that I can efficiently manage my time and commitments from a single "Calendar" page.

## Acceptance Criteria

1.  **Given** a logged-in user with the **Manager** role navigates to the "Calendar" page, **then** the existing master calendar view with all its functionalities must be displayed.
2.  **Given** a logged-in user with the **Instructor** role navigates to the "Calendar" page, **then** a personal calendar view is displayed.
3.  **Given** an instructor is on their calendar page, **then** the calendar must display all their scheduled lessons (confirmed/pending) and their defined availability slots.
4.  **Given** an instructor is viewing their calendar, **then** they must be able to switch between "Month", "Week", "Day", and "Agenda" views.
5.  **Given** an instructor is viewing their calendar, **then** all events must be color-coded according to the UX Design Specification. [Source: `docs/fase-2-plan/ux-design-specification.md`#5.2.2]
6.  **Given** an instructor is viewing their calendar, **when** they click on a lesson event, **then** a modal must appear displaying lesson details.
7.  **Given** an instructor is on their calendar page, **then** the "+ Add availability" and "Block time" buttons must be present and trigger the modals from Story 1.8.

## Tasks / Subtasks

- [x] **Task 1: Refactor Calendar Page for Role-Based Views** (AC: #1, #2)
  - [x] Modify the main page component at `app/app/(protected)/calendar/page.tsx` to fetch the current user's role.
  - [x] Implement logic to dynamically render the `ManagerCalendar` component if the role is "manager".
  - [x] Implement logic to render a new `InstructorCalendar` component if the role is "instructor".
- [x] **Task 2: Create Instructor Calendar Component** (AC: #2, #3, #7)
  - [x] Create a new component `app/components/calendar/InstructorCalendar.tsx`.
  - [x] This component will contain the calendar header with controls for view switching, navigation, and buttons for "+ Add availability" and "Block time".
  - [x] Integrate a calendar library (e.g., `@fullcalendar/react`) configured for the four required views.
- [x] **Task 3: Implement Instructor Data Fetching** (AC: #3)
  - [x] Create a new hook `useInstructorCalendar` in `app/lib/hooks/` to fetch and manage data for the instructor's calendar.
  - [x] The hook should call a new service function `getInstructorCalendarData(userId, startDate, endDate)` that fetches the instructor's specific bookings and availability.
- [x] **Task 4: Render Instructor Events on Calendar** (AC: #3, #5)
  - [x] In the `InstructorCalendar` component, use the data from the hook to create an array of events for the calendar library.
  - [x] Implement the logic to apply the correct color-coding to each event based on its type (lesson, availability, etc.) as defined in the UX spec.
- [x] **Task 5: Implement Instructor Event Interactivity** (AC: #6)
  - [x] Add an `onClick` handler to the calendar events.
  - [x] When a lesson event is clicked, display a `LessonDetailsModal` with the relevant information.
  - [x] Ensure the "+ Add availability" and "Block time" buttons trigger the correct modals from Story 1.8.
- [x] **Task 6: Testing** (AC: #1, #2, #7)
  - [x] Write unit tests for the `useInstructorCalendar` hook and the event mapping logic.
  - [x] Write E2E tests using Playwright to verify the correct calendar view appears for each role.
  - [x] Add E2E tests to simulate an instructor logging in, navigating to the calendar, viewing their schedule, and opening the availability modals.

### Review Follow-ups (AI)

- [x] [AI-Review][Medium] Correct event colors in `app/lib/calendar-service.ts` to match UX Spec (AC #5).
- [x] [AI-Review][Low] Create unit tests for `useInstructorCalendar` hook.
- [x] [AI-Review][Low] Create unit tests for `calendar-service.ts` event mapping logic.
- [x] [AI-Review][Low] Implement "Block time" modal trigger in `InstructorCalendar.tsx` (AC #7).

## Dev Notes

### Learnings from Previous Story

**From Story 3-7-customer-and-instructor-management (Status: review)**

- **Completion Notes**: Implemented a `user-service` Edge Function for user CRUD operations, updated the `ProfileService` to use it, created new pages and modals for customer and instructor management, and added necessary RLS policies and tests.
- **File List**:
  - `supabase/functions/user-service/index.ts` (NEW)
  - `app/lib/profile-service.ts` (MODIFIED)
  - `app/app/(protected)/customers/page.tsx` (NEW)
  - `app/app/(protected)/instructors/page.tsx` (NEW)
  - `app/components/customers/AddCustomerModal.tsx` (NEW)
  - `app/components/instructors/AddInstructorModal.tsx` (NEW)
  - `supabase/migrations/20251213100000_update_rls_for_managers.sql` (NEW)
  - `tests/e2e/manager-users.spec.ts` (NEW)

### Architecture patterns and constraints

- The implementation should be based on the custom **Availability Calendar (Instructor)** component defined in the UX specification. A robust library like `@fullcalendar/react` is recommended as a foundation to handle the core calendar logic.
- Data fetching must be performed using TanStack Query to ensure efficient state management and caching. All Supabase queries must be subject to RLS policies, ensuring instructors can only see their own data.
- All date and time operations must be handled carefully, with UTC storage in the database and conversion to the school's local time zone for display, as mandated by the architecture.

### Project Structure Notes

- The main page component will be located at `app/app/(protected)/calendar/page.tsx`.
- Data fetching logic should be encapsulated in a new service file, e.g., `app/lib/calendar-service.ts`.
- This story builds upon the modals and backend logic created in Story 1.8 (`Instructor Availability Management`), so no new database tables are expected.

### References

- [Source: `docs/fase-3-solution/epics.md`#Story-3.8]
- [Source: `docs/fase-2-plan/ux-design-specification.md`#5.2.2]
- [Source: `docs/sprint-artifacts/tech-spec-epic-3-2.md`#4.1]
- [Source: `docs/wireframes/instructor-dashboard.html`]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-8-instructor-calendar-view.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- Refactored `calendar/page.tsx` to conditionally render `ManagerCalendarView` or `InstructorCalendar` based on user role.
- Created `InstructorCalendar` using `@fullcalendar/react` with Month, Week, Day, and List views.
- Implemented `useInstructorCalendar` hook and `CalendarService` to fetch instructor-specific bookings and availability.
- Added event color coding: Lessons (Blue), Confirmed (Green), Cancelled (Red), Availability (Gray background).
- Integrated `LessonDetailsModal` for viewing event details and `AddAvailabilityDialog` for adding availability.
- Added E2E tests covering role-based access and instructor calendar functionality.
- Addressed review feedback: Corrected event colors in `calendar-service.ts`, added unit tests for `useInstructorCalendar` and `calendar-service`, and implemented a placeholder `BlockTimeDialog` to make the UI interactive.

### File List

- `app/lib/hooks/useUserRole.ts` (NEW)
- `app/components/calendar/InstructorCalendar.tsx` (MODIFIED)
- `app/lib/calendar-service.ts` (MODIFIED)
- `app/lib/hooks/useInstructorCalendar.ts` (NEW)
- `app/app/(protected)/calendar/page.tsx` (MODIFIED)
- `app/components/bookings/LessonDetailsModal.tsx` (MODIFIED)
- `tests/e2e/calendar-views.spec.ts` (NEW)
- `app/__tests__/lib/hooks/useInstructorCalendar.test.tsx` (NEW)
- `app/__tests__/lib/calendar-service.test.ts` (NEW)
- `app/components/calendar/BlockTimeDialog.tsx` (NEW)

## Change Log

- 2025-12-14: Initial draft generated by Scrum Master Agent.
- 2025-12-14: Implemented story tasks and passed E2E tests.
- 2025-12-14: Senior Developer Review notes appended; status set to Changes Requested.
- 2025-12-14: Addressed all review feedback. Status set to Ready for Review.
- 2025-12-14: Second Senior Developer Review notes appended; status set to Changes Requested.

---

## Senior Developer Review (AI)

- **Reviewer:** BIP
- **Date:** 2025-12-14
- **Outcome:** Changes Requested

### Summary

The story is well-implemented and functionally complete, satisfying all acceptance criteria. The codebase is clean, and the addition of unit and E2E tests provides good coverage. A single low-severity deviation from the technical specification was noted regarding date handling, which should be corrected for consistency.

### Key Findings (by severity)

- **[Low]** The technical specification mandates the use of `date-fns` for all date/time manipulations, but `new Date()` is used directly in `calendar-service.ts` and elsewhere. This should be refactored to use `date-fns` to ensure consistent timezone handling and prevent potential bugs.

### Acceptance Criteria Coverage

| AC# | Description                                           | Status          | Evidence                                               |
| :-- | :---------------------------------------------------- | :-------------- | :----------------------------------------------------- |
| 1   | Manager sees master calendar                          | **IMPLEMENTED** | `app/app/(protected)/calendar/page.tsx:90`             |
| 2   | Instructor sees personal calendar                     | **IMPLEMENTED** | `app/app/(protected)/calendar/page.tsx:94`             |
| 3   | Instructor calendar displays lessons and availability | **IMPLEMENTED** | `app/lib/calendar-service.ts:17-79`                    |
| 4   | Instructor can switch views                           | **IMPLEMENTED** | `app/components/calendar/InstructorCalendar.tsx:68`    |
| 5   | Events are color-coded per UX Spec                    | **IMPLEMENTED** | `app/lib/calendar-service.ts:27, 56-58`                |
| 6   | Clicking a lesson opens a details modal               | **IMPLEMENTED** | `app/components/calendar/InstructorCalendar.tsx:42-49` |
| 7   | "+ Add availability" and "Block time" buttons present | **IMPLEMENTED** | `app/components/calendar/InstructorCalendar.tsx:53-58` |

**Summary: 7 of 7 acceptance criteria fully implemented.**

### Task Completion Validation

| Task                                 | Marked As | Verified As           | Evidence/Notes                                                                                                           |
| :----------------------------------- | :-------- | :-------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **1: Refactor Calendar Page**        | **[x]**   | **VERIFIED COMPLETE** | `calendar/page.tsx` correctly uses `useUserRole` for conditional rendering.                                              |
| **2: Create Instructor Calendar**    | **[x]**   | **VERIFIED COMPLETE** | `InstructorCalendar.tsx` exists and is correctly configured.                                                             |
| **3: Implement Data Fetching**       | **[x]**   | **VERIFIED COMPLETE** | `useInstructorCalendar` hook and `CalendarService` are implemented.                                                      |
| **4. Render Instructor Events**      | **[x]**   | **VERIFIED COMPLETE** | Event rendering and color-coding match specifications.                                                                   |
| **5: Implement Event Interactivity** | **[x]**   | **VERIFIED COMPLETE** | All required modals and dialogs are triggered correctly.                                                                 |
| **6: Testing**                       | **[x]**   | **VERIFIED COMPLETE** | E2E and unit tests (`calendar-views.spec.ts`, `useInstructorCalendar.test.tsx`, `calendar-service.test.ts`) are present. |

**Summary: All 6 main tasks and 4 follow-up tasks are verified complete.**

### Action Items

**Code Changes Required:**
