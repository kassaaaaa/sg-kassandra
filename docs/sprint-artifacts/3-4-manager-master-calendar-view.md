# Story 3.4: Manager Master Calendar View

Status: drafted

## Story

As a Manager,
I want to view a master calendar of all school activities,
so that I have a complete overview of schedules.

## Acceptance Criteria

1.  **Master Calendar Display:** When a logged-in manager navigates to the "Calendar" page, a calendar interface shall be displayed showing all bookings for the entire school.
2.  **Filtering by Instructor:** The calendar view must include a mechanism (e.g., a dropdown or multi-select) to filter the displayed bookings by one or more instructors.
3.  **Filtering by Lesson Type:** The calendar view must include a mechanism to filter the displayed bookings by lesson type.
4.  **Multiple Views:** The calendar must support switching between month, week, and day views.
5.  **Data Source:** The calendar shall fetch its data from the `/edge/manager/calendar` endpoint, passing the appropriate filters as query parameters.
6.  **Read-Only Data:** The initial implementation should present the booking data as read-only. Manual booking management (add, edit, cancel) is handled in a subsequent story (3.5).
7.  **UX Alignment:** The calendar component should be based on the `Availability Calendar` component from Epic 1, adapted for manager use as per the technical notes in `epics.md`.

## Tasks / Subtasks

- [ ] **Task 1: Create Manager Calendar Page and Component (AC: #1, #7)**
    - [ ] Create a new route and page file at `app/(protected)/calendar/page.tsx`.
    - [ ] Create a new `ManagerCalendar.tsx` component in `app/components/calendar/`.
    - [ ] Adapt the existing `AvailabilityCalendar` component to serve as the base for the `ManagerCalendar`, removing instructor-specific editing features.

- [ ] **Task 2: Implement Data Fetching for Master Schedule (AC: #5)**
    - [ ] Extend the `useManagerDashboard` hook or create a new `useManagerCalendar` hook to fetch all bookings from the `/edge/manager/calendar` endpoint using TanStack Query.
    - [ ] The hook must manage state for the date range and any active filters.

- [ ] **Task 3: Implement Filtering UI (AC: #2, #3)**
    - [ ] Add dropdown filters for "Instructors" and "Lesson Types" to the `ManagerCalendar` component.
    - [ ] The filter controls should be populated with data fetched from the backend.
    - [ ] Applying a filter should trigger a refetch of the calendar data with the appropriate query parameters.

- [ ] **Task 4: Implement Calendar Views (AC: #4)**
    - [ ] Ensure the view switcher (Month, Week, Day) is present and functional.
    - [ ] The calendar display should re-render correctly when the view is changed.

- [ ] **Task 5: Testing (AC: #1, #2, #3, #4)**
    - [ ] Write unit tests for the `ManagerCalendar` component, mocking the data fetching hook.
    - [ ] Write an E2E test for the Manager Calendar that:
        - Navigates to the `/calendar` page.
        - Verifies that bookings are displayed.
        - Tests the instructor and lesson type filters and asserts the view updates correctly.
        - Tests the view switcher (month, week, day).

## Dev Notes

### Learnings from Previous Story

**From Story 3.3 (Status: review)**

- **RLS Policies are Critical:** Any new Supabase queries for the master calendar must be covered by RLS policies that grant managers read-access to all `bookings`, `profiles`, and `lessons` across the school.
- **Data Fetching Pattern:** The established pattern is to use a dedicated hook (e.g., `useManagerDashboard`) with TanStack Query. A new `useManagerCalendar` hook should be created following this pattern.
- **E2E Test Structure:** New E2E tests should follow the structure established in `tests/e2e/manager-dashboard.spec.ts` and `tests/e2e/resolution-center.spec.ts`.
- **Files Created in Previous Story**: `app/(protected)/resolution-center/page.tsx`, `app/components/dashboard/ResolutionCenter.tsx`, `app/components/dashboard/ResolutionConflictItem.tsx`, `app/components/dashboard/__tests__/ResolutionCenter.test.tsx`, `tests/e2e/resolution-center.spec.ts`.
- **Files Modified in Previous Story**: `app/lib/hooks/useManagerDashboard.ts`.

[Source: docs/sprint-artifacts/3-3-build-manager-resolution-center-ui.md]

### Project Structure Notes

- **Route:** `app/(protected)/calendar/page.tsx`
- **Components:** New components should be placed in `app/components/calendar/`.
- **Hooks:** Data fetching logic should be in `app/lib/hooks/`.

### References

- **Epics:** Story 3.4 `Manager Master Calendar View` [Source: docs/fase-3-solution/epics.md]
- **Tech Spec:** Epic 3 - `ManagerCalendar (UI)` component and `GET /edge/manager/calendar` API. [Source: docs/sprint-artifacts/tech-spec-epic-3.md]
- **UX Design Spec:** Section 5.2.2 `Availability Calendar (Instructor)` to be used as a base. [Source: docs/fase-2-plan/ux-design-specification.md]
- **Architecture:** General guidance on Next.js App Router, Supabase client usage, and TanStack Query. [Source: docs/fase-3-solution/architecture.md]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-12-11: Initial draft created from epic.
