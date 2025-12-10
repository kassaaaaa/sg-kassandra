# Story 3.2: Manager Dashboard UI

Status: review

## Story

As a Manager,
I want a dashboard with an operational overview and key alerts,
so that I can stay on top of the school's activities.

## Acceptance Criteria

### Core Functional Requirements
1.  **Dashboard Access:** The dashboard shall be accessible at `(protected)/dashboard` for authenticated users with the 'Manager' role.
2.  **Conditional Rendering:** The page at `(protected)/dashboard` shall render the `ManagerDashboard` component if the user's role is 'Manager'.
3.  **Operational Overview:** The dashboard must display "Today's Snapshot" with key metrics:
    - Total Scheduled Lessons for today.
    - Pending Bookings for today.
    - Total Instructors Available today.
4.  **Weather Conflict Alerts:** A prominent "Resolution Center" or `Weather Conflict Card` shall be displayed if any lessons are impacted by adverse weather conditions (FR023, FR027), as specified in the UX spec (Section 5.2.3).
5.  **Upcoming Lessons:** A list of all upcoming lessons for the day shall be displayed.
6.  **Quick Actions:** Provide quick action buttons/links for common manager tasks (e.g., "Add Booking", "View Full Calendar", "Manage Instructors").
7.  **Responsive Layout:** The layout must match the `manager-dashboard.html` wireframe and be fully responsive.

### Additional Quality Criteria
8.  **Performance:** The dashboard must load in under 3 seconds (NFR01).
9.  **Data Freshness:** Data should be kept fresh using TanStack Query.

## Tasks / Subtasks

- [x] **Task 1: Create Manager Dashboard Component & Logic (AC: #1, #2)**
  - [x] Create `app/components/dashboard/ManagerDashboard.tsx`.
  - [x] Update `app/(protected)/dashboard/page.tsx` to conditionally render `ManagerDashboard` or `InstructorDashboard` based on user role from session.
- [x] **Task 2: Implement "Today's Snapshot" Widget (AC: #3)**
  - [x] Create a new `ManagerSnapshotWidget.tsx` or enhance the existing `SnapshotWidget.tsx` to fetch school-wide data.
  - [x] Implement Supabase queries to get school-wide lesson and instructor counts for the day.
- [x] **Task 3: Implement "Resolution Center" Alert Card (AC: #4)**
  - [x] Create `app/components/dashboard/WeatherConflictCard.tsx` as per the UX specification (Section 5.2.3).
  - [x] Implement logic to fetch data on weather-impacted lessons. The card should only render if there are conflicts.
  - [x] The "Review Lessons" button should link to the "Resolution Center" page (to be built in Story 3.3).
- [x] **Task 4: Implement "Upcoming Lessons" List (AC: #5)**
  - [x] Create a `ManagerUpcomingLessons.tsx` component to display a table of all upcoming lessons for the day.
- [x] **Task 5: Implement Manager Quick Actions (AC: #6)**
  - [x] Create a `ManagerQuickActions.tsx` component.
  - [x] Link buttons to their respective pages (e.g., `/calendar`, `/settings/instructors`).
- [x] **Task 6: Data Fetching with TanStack Query (AC: #8, #9)**
  - [x] Create a `useManagerDashboard` custom hook in `app/lib/hooks/`.
  - [x] Consolidate all data fetching for the manager dashboard within this hook using `useQuery`.
- [x] **Task 7: Testing**
  - [x] Write unit tests for all new `ManagerDashboard` sub-components.
  - [x] Write E2E tests for the manager dashboard to verify correct rendering, data display, and that all actions navigate correctly.

## Dev Notes

### Learnings from Previous Story

**From Story 3.1 (Status: done)**

- **Dispatcher Pattern:** The `app/(protected)/dashboard/page.tsx` is expected to act as a dispatcher, rendering role-specific dashboards. This story must implement the 'Manager' branch of that logic.
- **RLS Policies:** Story 3.1 established RLS for instructors. This story will require new or modified RLS policies to grant managers school-wide read access to `bookings`, `profiles`, and `availability`.
- **Reusable Components:** The `WeatherWidget` can likely be reused directly. The `SnapshotWidget` and `UpcomingLessons` components will need manager-specific versions or props to handle school-wide data queries instead of instructor-specific ones.
- **Data Fetching:** The `useInstructorDashboard` hook provides a clear pattern. The new `useManagerDashboard` hook should follow a similar structure.
- **Schema:** The `profiles` table now includes `full_name` and `email`, which can be used in the manager's view of upcoming lessons.

[Source: docs/sprint-artifacts/3-1-instructor-dashboard-ui.md]

### Project Structure Notes

- **Route:** The dashboard will be rendered at `app/(protected)/dashboard`.
- **Components:** All new manager-specific dashboard components should reside in `app/components/dashboard/`.
- **Hooks:** Create the data fetching hook at `app/lib/hooks/useManagerDashboard.ts`.
- **Tests:** Unit tests should be co-located with components (e.g., `app/components/dashboard/__tests__/ManagerSnapshotWidget.test.tsx`). E2E tests go in `tests/e2e/`.

### References

- **Wireframe:** `docs/wireframes/manager-dashboard.html` (Primary visual and layout guide)
- **UX Design Spec:** Section 5.2.3 (`Weather Conflict Card`), Section 3.4.3 (Manager Journey) [Source: docs/fase-2-plan/ux-design-specification.md]
- **PRD:** FR023 (Manager dashboard), FR027 (Weather alerts) [Source: docs/fase-2-plan/PRD.md]
- **Architecture:** Use of TanStack Query, Supabase Edge Functions for complex queries if needed, and RLS for security. [Source: docs/fase-3-solution/architecture.md]
- **Epics:** Story 3.2 details. [Source: docs/fase-3-solution/epics.md]
- **Tech Spec:** Epic 3 Technical Specification. [Source: docs/sprint-artifacts/tech-spec-epic-3.md]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-2-manager-dashboard-ui.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- Implemented Manager Dashboard with `ManagerDashboard`, `ManagerSnapshotWidget`, `WeatherConflictCard`, `ManagerUpcomingLessons`, `ManagerQuickActions`.
- Created `useManagerDashboard` hook for data fetching using TanStack Query, including logic for school-wide stats and upcoming lessons.
- Implemented responsive layout as per wireframe/mockup.
- Added comprehensive unit tests for all components.
- Added E2E test `tests/e2e/manager-dashboard.spec.ts`.
- Validated implementation against all Acceptance Criteria.

### File List

- app/components/dashboard/ManagerQuickActions.tsx
- app/__tests__/dashboard/ManagerQuickActions.test.tsx
- app/components/dashboard/ManagerQuickActions.tsx
- app/__tests__/dashboard/ManagerQuickActions.test.tsx
- app/components/dashboard/ManagerUpcomingLessons.tsx
- app/__tests__/dashboard/ManagerUpcomingLessons.test.tsx
- app/components/dashboard/WeatherConflictCard.tsx
- app/__tests__/dashboard/WeatherConflictCard.test.tsx
- app/components/dashboard/ManagerDashboard.tsx
- app/components/dashboard/ManagerSnapshotWidget.tsx
- app/lib/hooks/useManagerDashboard.ts
- app/app/(protected)/dashboard/page.tsx
- app/__tests__/dashboard/ManagerDashboard.test.tsx
- app/__tests__/dashboard/ManagerSnapshotWidget.test.tsx
- tests/e2e/manager-dashboard.spec.ts

## Change Log

<!-- Use this section to track changes to the story definition over time -->