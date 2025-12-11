# Story 3.4: Manager Master Calendar View

Status: done

## Story

As a Manager,
I want to view a master calendar of all school activities,
so that I have a complete overview of schedules.

## Acceptance Criteria

1.  **Master Calendar Display:** When a logged-in manager navigates to the "Calendar" page, a calendar interface shall be displayed showing all bookings and instructor availability for the entire school. [Source: tech-spec-epic-3.md, FR024.a]
2.  **Filtering by Instructor:** The calendar view must include a mechanism (e.g., a dropdown or multi-select) to filter the displayed bookings by one or more instructors. [Source: tech-spec-epic-3.md, FR024.b]
3.  **Filtering by Lesson Type:** The calendar view must include a mechanism to filter the displayed bookings by lesson type. [Source: tech-spec-epic-3.md, FR024.c]

## Tasks / Subtasks

- [x] **Task 1: Create Manager Calendar Page and Component (AC: #1)**

  - [x] Create a new route and page file at `app/(protected)/calendar/page.tsx`.
  - [x] Create a new `ManagerCalendar.tsx` component in `app/components/calendar/`.
  - [x] Adapt the existing `AvailabilityCalendar` component to serve as the base for the `ManagerCalendar`, ensuring it is read-only.

- [x] **Task 2: Implement Data Fetching for Master Schedule (AC: #1)**

  - [x] Extend the `useManagerDashboard` hook or create a new `useManagerCalendar` hook to fetch all bookings from the `/edge/manager/calendar` endpoint using TanStack Query.
  - [x] The hook must manage state for the date range and any active filters.

- [x] **Task 3: Implement Filtering UI (AC: #2, #3)**

  - [x] Add dropdown filters for "Instructors" and "Lesson Types" to the `ManagerCalendar` component.
  - [x] The filter controls should be populated with data fetched from the backend.
  - [x] Applying a filter should trigger a refetch of the calendar data with the appropriate query parameters.

- [x] **Task 4: Testing (AC: #1, #2, #3)**
  - [x] Write unit tests for the `ManagerCalendar` component, mocking the data fetching hook.
      - [x] Write an E2E test for the Manager Calendar that:
          - Navigates to the `/calendar` page.
          - Verifies that bookings are displayed.
          - Tests the instructor and lesson type filters and asserts the view updates correctly.
  
  ### Review Follow-ups (AI)
  
  - [x] [AI-Review][High] Update `tests/e2e/manager-master-calendar.spec.ts` to click instructor/lesson type filters and assert that the calendar grid updates (AC #2, #3)
  - [x] [AI-Review][Med] Ensure `school_settings` table migration for `lesson_types` exists or is created (AC #1)
  
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

- **Epics:** Story 3.4 `Manager Master Calendar View` [Source: docs/fase-3-solution/epics.md, Story 3.4]
- **Tech Spec:** Master Calendar View (FR024) [Source: docs/sprint-artifacts/tech-spec-epic-3.md, Section: FR024]
- **Architecture:** General guidance on Next.js App Router, Supabase client usage, and TanStack Query. [Source: docs/fase-3-solution/architecture.md]

## Dev Agent Record

### Context Reference

docs/sprint-artifacts/3-4-manager-master-calendar-view.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

- Encountered 404/500 errors initially due to file placement issues with nested app router paths. Resolved by correcting directory structure.
- `school_settings` table missing in DB causing initial fetch error for lesson types. Added fallback data for development to ensure UI is testable.

### Completion Notes List

- Implemented `ManagerCalendar` reusing `AvailabilityCalendar` logic but adapted for read-only booking display.
- Created `useManagerCalendar` hook for fetching bookings and availability with date range support.
- Implemented `CalendarFilters` with real-time state updates.
- Added `useSchoolData` hook to fetch instructors and lesson types (with fallback).
- Updated middleware to protect `/calendar` route for managers.
- Added comprehensive Unit and E2E tests covering ACs.
- ✅ Resolved review finding [High]: Updated E2E tests to verify filter functionality.
- ✅ Resolved review finding [Med]: Verified migration for `school_settings` exists.
- Fixed a bug in `page.tsx` preventing filters from clearing correctly (race condition).

### File List

- `app/(protected)/calendar/page.tsx`
- `app/components/calendar/ManagerCalendar.tsx`
- `app/components/calendar/CalendarFilters.tsx`
- `app/components/calendar/__tests__/ManagerCalendar.test.tsx`
- `app/lib/hooks/useManagerCalendar.ts`
- `app/lib/hooks/useSchoolData.ts`
- `app/lib/availability-service.ts`
- `app/middleware.ts`
- `tests/e2e/manager-master-calendar.spec.ts`
- `supabase/migrations/20251211000000_add_lesson_types_to_school_settings.sql`

## Change Log

- 2025-12-11: Initial draft created from epic.
- 2025-12-11: Aligned ACs and tasks with Tech Spec FR024, removing scope creep and improving citations.
- 2025-12-11: Implementation complete. All tasks verified.
- 2025-12-11: Senior Developer Review notes appended.
- 2025-12-11: Addressed code review findings - 2 items resolved. Fixed filter clearing bug.
- 2025-12-11: Senior Developer Review passed. Status updated to done.

## Senior Developer Review (AI)

- **Reviewer:** Amelia (AI)
- **Date:** 2025-12-11
- **Outcome:** **APPROVE**
    - **Justification:** All acceptance criteria are met. The critical E2E test issue from the previous review has been resolved; the test now actively verifies the filtering logic by interacting with the UI and asserting visibility changes. Code quality is good and follows project patterns.

### Summary
The implementation of the Manager Master Calendar is complete and robust. The solution leverages the existing `AvailabilityCalendar` pattern adapted for read-only manager views. Data fetching is handled efficiently via TanStack Query with correct backend filtering for instructors and client-side filtering for lesson types. The filtering UI is intuitive and responsive. Security policies for `school_settings` were correctly added.

### Key Findings

- **[Low]** Client-side filtering for lesson types in `useManagerCalendar` is acceptable for current scale but may need server-side implementation if booking volume grows significantly.
- **[Low]** Calendar hours (07:00 - 20:00) are hardcoded in `ManagerCalendar.tsx`. Future iterations should consider making this configurable via `school_settings`.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
| :-- | :--- | :--- | :--- |
| 1 | Master Calendar Display | **IMPLEMENTED** | `ManagerCalendar.tsx`, `useManagerCalendar.ts` |
| 2 | Filtering by Instructor | **IMPLEMENTED** | `CalendarFilters.tsx`, `useManagerCalendar.ts` (query filter) |
| 3 | Filtering by Lesson Type | **IMPLEMENTED** | `CalendarFilters.tsx`, `useManagerCalendar.ts` (JS filter) |

**Summary:** 3 of 3 acceptance criteria implemented.

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
| :-- | :--- | :--- | :--- |
| 1. Create Page/Component | [x] | **COMPLETE** | `app/(protected)/calendar/page.tsx` exists |
| 2. Data Fetching | [x] | **COMPLETE** | `useManagerCalendar.ts` exists |
| 3. Filtering UI | [x] | **COMPLETE** | `CalendarFilters.tsx` exists |
| 4. Testing | [x] | **VERIFIED COMPLETE** | `manager-master-calendar.spec.ts` passes and interacts with filters |

### Test Coverage and Gaps

- **Unit Tests:** `ManagerCalendar.test.tsx` passes and covers rendering.
- **E2E Tests:** `manager-master-calendar.spec.ts` passes and actively tests filtering logic.

### Architectural Alignment

- **Alignment:** Follows the project's App Router and TanStack Query patterns.
- **Security:** RLS policies observed. Middleware protection confirmed.

### Action Items

**Advisory Notes:**
- Note: Consider moving lesson type filtering to the backend (Supabase Query) for performance if dataset grows.
- Note: Make calendar start/end hours configurable via `school_settings` in future iteration.

