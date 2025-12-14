# Story 3.8: Instructor Calendar View

Status: drafted

## Story

As an Instructor,
I want to view my schedule on an interactive calendar,
so that I can easily see my commitments.

## Acceptance Criteria

1.  **Given** a logged-in instructor navigates to the "Calendar" page, **then** the page layout must match the `instructor-calendar.html` mockup, including the sidebar and main calendar view. (AC from Story 3.8)
2.  **Given** the instructor is on the calendar page, **then** the calendar must display all of their scheduled lessons (both confirmed and pending) and their defined availability slots for the currently viewed date range. (AC from Story 3.8)
3.  **Given** the instructor is viewing the calendar, **then** they must be able to switch between "Month", "Week", "Day", and "Agenda" views using the view switcher in the header. (AC from Story 3.8)
4.  **Given** the calendar is displayed, **then** all events must be color-coded according to the legend defined in the UX Design Specification (Confirmed, Pending, Available, Blocked). [Source: `docs/fase-2-plan/ux-design-specification.md`#5.2.2]
5.  **Given** an instructor is viewing their schedule, **when** they click on a lesson event, **then** a modal or popover must appear displaying detailed information about that lesson.
6.  **Given** the calendar page is open, **then** the "+ Add availability" and "Block time" buttons must be present in the header and must trigger the corresponding modal dialogs implemented in Story 1.8.

## Tasks / Subtasks

- [ ] **Task 1: Create Instructor Calendar Page Component** (AC: #1)
    - [ ] Create the file `app/app/(protected)/calendar/page.tsx`.
    - [ ] Implement the two-part layout with the persistent left sidebar and the main content area for the calendar, based on the `instructor-calendar.html` wireframe.
- [ ] **Task 2: Implement Calendar Header and Controls** (AC: #3, #6)
    - [ ] Add the calendar title, "Today" button, and next/previous navigation controls.
    - [ ] Implement the view switcher component with buttons for Month, Week, Day, and Agenda views.
    - [ ] Integrate the existing "+ Add availability" and "Block time" buttons, ensuring they open the correct modals.
- [ ] **Task 3: Integrate and Configure Calendar Library** (AC: #2, #3)
    - [ ] Integrate a calendar library (e.g., `@fullcalendar/react`) as the foundation for the custom `Availability Calendar` component. [Source: `docs/sprint-artifacts/tech-spec-epic-3-2.md`#6]
    - [ ] Configure the library to support the four required views (Month, Week, Day, Agenda).
- [ ] **Task 4: Implement Data Fetching** (AC: #2)
    - [ ] Create a new service function `getCalendarData(userId, startDate, endDate)` in a `lib/` service file.
    - [ ] The function should query the Supabase database to fetch both `bookings` and `availability` records for the logged-in instructor within the given date range.
    - [ ] Use TanStack Query (`useQuery`) within the calendar page component to call this service function.
- [ ] **Task 5: Render Events on Calendar** (AC: #2, #4)
    - [ ] In the page component, transform the fetched bookings and availability data into an array of events that the calendar library can render.
    - [ ] Implement the logic to apply the correct styling (color-coding, borders, etc.) to each event based on its type as defined in the UX spec.
- [ ] **Task 6: Implement Event Interactivity** (AC: #5)
    - [ ] Add an `onClick` handler to the calendar events.
    - [ ] When an event is clicked, display a modal or popover showing the full details of the lesson or availability block.
- [ ] **Task 7: Finalize Styling and Responsiveness** (AC: #1)
    - [ ] Ensure all visual aspects of the calendar page align with the `instructor-calendar.html` mockup and the `ux-design-specification.md`.
    - [ ] Verify that the layout is fully responsive and usable on mobile, tablet, and desktop screen sizes.
- [ ] **Task 8: Testing**
    - [ ] Write unit tests for the `getCalendarData` service function and the event mapping logic.
    - [ ] Write E2E tests using Playwright to simulate an instructor logging in, navigating to the calendar, and viewing their schedule.

## Dev Notes

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
