# Story 3.8: Unified Calendar View (Manager/Instructor)

Status: ready-for-dev

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

- [ ] **Task 1: Refactor Calendar Page for Role-Based Views** (AC: #1, #2)
    - [ ] Modify the main page component at `app/app/(protected)/calendar/page.tsx` to fetch the current user's role.
    - [ ] Implement logic to dynamically render the `ManagerCalendar` component if the role is "manager".
    - [ ] Implement logic to render a new `InstructorCalendar` component if the role is "instructor".
- [ ] **Task 2: Create Instructor Calendar Component** (AC: #2, #3, #7)
    - [ ] Create a new component `app/components/calendar/InstructorCalendar.tsx`.
    - [ ] This component will contain the calendar header with controls for view switching, navigation, and buttons for "+ Add availability" and "Block time".
    - [ ] Integrate a calendar library (e.g., `@fullcalendar/react`) configured for the four required views.
- [ ] **Task 3: Implement Instructor Data Fetching** (AC: #3)
    - [ ] Create a new hook `useInstructorCalendar` in `app/lib/hooks/` to fetch and manage data for the instructor's calendar.
    - [ ] The hook should call a new service function `getInstructorCalendarData(userId, startDate, endDate)` that fetches the instructor's specific bookings and availability.
- [ ] **Task 4: Render Instructor Events on Calendar** (AC: #3, #5)
    - [ ] In the `InstructorCalendar` component, use the data from the hook to create an array of events for the calendar library.
    - [ ] Implement the logic to apply the correct color-coding to each event based on its type (lesson, availability, etc.) as defined in the UX spec.
- [ ] **Task 5: Implement Instructor Event Interactivity** (AC: #6)
    - [ ] Add an `onClick` handler to the calendar events.
    - [ ] When a lesson event is clicked, display a `LessonDetailsModal` with the relevant information.
    - [ ] Ensure the "+ Add availability" and "Block time" buttons trigger the correct modals from Story 1.8.
- [ ] **Task 6: Testing** (AC: #1, #2, #7)
    - [ ] Write unit tests for the `useInstructorCalendar` hook and the event mapping logic.
    - [ ] Write E2E tests using Playwright to verify the correct calendar view appears for each role.
    - [ ] Add E2E tests to simulate an instructor logging in, navigating to the calendar, viewing their schedule, and opening the availability modals.


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
-   The implementation should be based on the custom **Availability Calendar (Instructor)** component defined in the UX specification. A robust library like `@fullcalendar/react` is recommended as a foundation to handle the core calendar logic.
-   Data fetching must be performed using TanStack Query to ensure efficient state management and caching. All Supabase queries must be subject to RLS policies, ensuring instructors can only see their own data.
-   All date and time operations must be handled carefully, with UTC storage in the database and conversion to the school's local time zone for display, as mandated by the architecture.

### Project Structure Notes

-   The main page component will be located at `app/app/(protected)/calendar/page.tsx`.
-   Data fetching logic should be encapsulated in a new service file, e.g., `app/lib/calendar-service.ts`.
-   This story builds upon the modals and backend logic created in Story 1.8 (`Instructor Availability Management`), so no new database tables are expected.

### References

-   [Source: `docs/fase-3-solution/epics.md`#Story-3.8]
-   [Source: `docs/fase-2-plan/ux-design-specification.md`#5.2.2]
-   [Source: `docs/sprint-artifacts/tech-spec-epic-3-2.md`#4.1]
-   [Source: `docs/wireframes/instructor-dashboard.html`]

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/3-8-instructor-calendar-view.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-12-14: Initial draft generated by Scrum Master Agent.

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

- [ ] **Task 1: Refactor Calendar Page for Role-Based Views** (AC: #1, #2)
    - [ ] Modify the main page component at `app/app/(protected)/calendar/page.tsx` to fetch the current user's role.
    - [ ] Implement logic to dynamically render the `ManagerCalendar` component if the role is "manager".
    - [ ] Implement logic to render a new `InstructorCalendar` component if the role is "instructor".
- [ ] **Task 2: Create Instructor Calendar Component** (AC: #2, #3, #7)
    - [ ] Create a new component `app/components/calendar/InstructorCalendar.tsx`.
    - [ ] This component will contain the calendar header with controls for view switching, navigation, and buttons for "+ Add availability" and "Block time".
    - [ ] Integrate a calendar library (e.g., `@fullcalendar/react`) configured for the four required views.
- [ ] **Task 3: Implement Instructor Data Fetching** (AC: #3)
    - [ ] Create a new hook `useInstructorCalendar` in `app/lib/hooks/` to fetch and manage data for the instructor's calendar.
    - [ ] The hook should call a new service function `getInstructorCalendarData(userId, startDate, endDate)` that fetches the instructor's specific bookings and availability.
- [ ] **Task 4: Render Instructor Events on Calendar** (AC: #3, #5)
    - [ ] In the `InstructorCalendar` component, use the data from the hook to create an array of events for the calendar library.
    - [ ] Implement the logic to apply the correct color-coding to each event based on its type (lesson, availability, etc.) as defined in the UX spec.
- [ ] **Task 5: Implement Instructor Event Interactivity** (AC: #6)
    - [ ] Add an `onClick` handler to the calendar events.
    - [ ] When a lesson event is clicked, display a `LessonDetailsModal` with the relevant information.
    - [ ] Ensure the "+ Add availability" and "Block time" buttons trigger the correct modals from Story 1.8.
- [ ] **Task 6: Testing** (AC: #1, #2, #7)
    - [ ] Write unit tests for the `useInstructorCalendar` hook and the event mapping logic.
    - [ ] Write E2E tests using Playwright to verify the correct calendar view appears for each role.
    - [ ] Add E2E tests to simulate an instructor logging in, navigating to the calendar, viewing their schedule, and opening the availability modals.


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
-   The implementation should be based on the custom **Availability Calendar (Instructor)** component defined in the UX specification. A robust library like `@fullcalendar/react` is recommended as a foundation to handle the core calendar logic.
-   Data fetching must be performed using TanStack Query to ensure efficient state management and caching. All Supabase queries must be subject to RLS policies, ensuring instructors can only see their own data.
-   All date and time operations must be handled carefully, with UTC storage in the database and conversion to the school's local time zone for display, as mandated by the architecture.

### Project Structure Notes

-   The main page component will be located at `app/app/(protected)/calendar/page.tsx`.
-   Data fetching logic should be encapsulated in a new service file, e.g., `app/lib/calendar-service.ts`.
-   This story builds upon the modals and backend logic created in Story 1.8 (`Instructor Availability Management`), so no new database tables are expected.

### References

-   [Source: `docs/fase-3-solution/epics.md`#Story-3.8]
-   [Source: `docs/fase-2-plan/ux-design-specification.md`#5.2.2]
-   [Source: `docs/sprint-artifacts/tech-spec-epic-3-2.md`#4.1]
-   [Source: `docs/wireframes/instructor-dashboard.html`]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-12-14: Initial draft generated by Scrum Master Agent.
