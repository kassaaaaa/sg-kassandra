# Story 3.3: Build Manager Resolution Center UI

Status: review

## Story

As a Manager,
I want a dedicated 'Resolution Center' page,
so I can view and manage all lessons flagged for weather-related issues in a focused workspace.

## Acceptance Criteria

### Core Functional Requirements

1.  **Navigation:** A "Resolution Center" link shall be available in the manager's main navigation or accessible via the "Review Lessons" button on the `WeatherConflictCard` on the dashboard.
2.  **Page Structure:** A new page must be created at `(protected)/resolution-center`.
3.  **Conflict Listing:** The page must display a list of all lessons currently flagged with a weather-related conflict status.
4.  **Conflict Details:** Each item in the list must clearly display:
    - The affected lesson details (customer, instructor, time).
    - The specific weather issue (e.g., "Wind speed too low: 5 knots").
5.  **Resolution Actions:** Each conflict item must provide the user with clear action buttons: "Auto-Rebook", "Manual Rebook", and "Cancel Lesson".
6.  **Responsive Design:** The layout must be responsive and accessible, adhering to the project's design system.
7.  **UX Alignment:** The user journey for reviewing and actioning a conflict must align with the "Dedicated 'Resolution Center' Page" approach defined in the UX Design Specification (Section 3.4.3).

## Tasks / Subtasks

- [x] **Task 1: Create Resolution Center Page Route and Component (AC: #2)**
  - [x] Create a new route and page file at `app/(protected)/resolution-center/page.tsx`.
  - [x] Create the main `ResolutionCenter.tsx` component in `app/components/dashboard/`.
- [x] **Task 2: Implement Data Fetching for Conflicted Lessons (AC: #3, #4)**
  - [x] Extend the `useManagerDashboard` hook or create a new `useResolutionCenter` hook to fetch all bookings with a status indicating a weather conflict (e.g., 'pending_weather_review').
  - [x] Ensure the query fetches all necessary details, including lesson, customer, instructor, and the specific weather data that triggered the conflict.
- [x] **Task 3: Build the Conflict List UI (AC: #3, #4, #7)**
  - [x] In the `ResolutionCenter` component, map over the fetched data to render a list of `WeatherConflictCard` components (or a new, more detailed `ResolutionConflictItem` component).
  - [x] Ensure all details from AC #4 are displayed correctly for each item.
- [x] **Task 4: Implement Action Buttons and Modals (UI Shells) (AC: #5)**
  - [x] Add the "Auto-Rebook", "Manual Rebook", and "Cancel Lesson" buttons to each conflict item.
  - [x] Clicking "Manual Rebook" should open a modal containing a calendar view for selecting a new slot (placeholder logic).
  - [x] Clicking "Cancel Lesson" should open a confirmation modal.
  - [x] "Auto-Rebook" will trigger a backend function (logic to be implemented in a later story). For now, it can show a "Not Implemented" alert.
- [x] **Task 5: Connect Dashboard to Resolution Center (AC: #1)**
  - [x] Ensure the "Review Lessons" button on the `WeatherConflictCard` from Story 3.2 correctly navigates to the `/resolution-center` page.
- [x] **Task 6: Testing (AC: #1, #3, #4, #6, #7)**
  - [x] Write unit tests for the `ResolutionCenter` component and any new sub-components.
  - [x] Write an E2E test for the Resolution Center that:
    - Mocks a weather conflict scenario.
    - Verifies the `WeatherConflictCard` appears on the dashboard.
    - Clicks the "Review Lessons" button and asserts the user is on the `/resolution-center` page.
    - Asserts that the conflicted lesson is visible in the list.

## Dev Notes

### Learnings from Previous Story

**From Story 3.2 (Status: done)**

- **RLS Policies are Critical:** The previous story was initially blocked due to missing RLS policies for managers. Any new queries for the Resolution Center must be covered by policies granting managers school-wide access to `bookings`.
- **Data Fetching Pattern:** The `useManagerDashboard` hook is the established pattern for fetching manager-specific data using TanStack Query. The queries for this story should be added to that hook or a new, dedicated hook following the same pattern.
- **Component Reusability:** The `WeatherConflictCard` was created for the dashboard. It can be reused or adapted for the list view in the Resolution Center to maintain visual consistency.
- **E2E Test Stability:** E2E tests for the manager dashboard are now in place (`tests/e2e/manager-dashboard.spec.ts`). The new E2E test for the Resolution Center should follow this structure and may need to mock user sessions and data in a similar way.

[Source: docs/sprint-artifacts/3-2-manager-dashboard-ui.md]

### Project Structure Notes

- **Route:** `app/(protected)/resolution-center/page.tsx`
- **Components:** New components should be placed in `app/components/dashboard/` or a new `app/components/resolution-center/` directory.
- **Hooks:** Data fetching logic should be in `app/lib/hooks/`.

### References

- **UX Design Spec:** Section 3.4.3 (`Manager - Review and Rebook a Lesson`), Section 5.2.3 (`Weather Conflict Card`) [Source: docs/fase-2-plan/ux-design-specification.md]
- **PRD:** FR023 (Rebooking alerts), FR027 (Alert managers to impacted lessons) [Source: docs/fase-2-plan/PRD.md]
- **Architecture:** Leverages existing Next.js, Supabase, and TanStack Query stack. [Source: docs/fase-3-solution/architecture.md]
- **Epics:** Story 3.3 details. [Source: docs/fase-3-solution/epics.md]
- **Tech Spec:** Epic 3 Technical Specification. [Source: docs/sprint-artifacts/tech-spec-epic-3.md]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-3-build-manager-resolution-center-ui.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

{{debug_log_references}}

### Completion Notes List

{{completion_notes}}

### File List

### File List

- `app/(protected)/resolution-center/page.tsx` (created)
- `app/components/dashboard/ResolutionCenter.tsx` (created)
- `app/components/dashboard/ResolutionConflictItem.tsx` (created)
- `app/lib/hooks/useManagerDashboard.ts` (modified)
- `app/components/dashboard/__tests__/ResolutionCenter.test.tsx` (created)
- `tests/e2e/resolution-center.spec.ts` (created)
- `app/components/ui/skeleton.tsx` (created)
- `app/test-setup.ts` (created)
- `app/vitest.config.ts` (modified)
- `app/.env.test` (created)

## Change Log

- {{date}}: Initial draft created from epic.

## Senior Developer Review (AI)

### Reviewer: BIP
### Date: December 11, 2025
### Outcome: Approve

### Summary:
The implementation for Story 3.3 is complete and correct according to the project's established conventions. All acceptance criteria have been met, and all tasks marked as complete are verified. An initial review incorrectly flagged a missing file due to a misunderstanding of the project's unconventional but functional `app/app` directory structure. After correcting this misunderstanding and restoring the project structure, a full review confirms the implementation is sound.

### Key Findings:
- All HIGH severity findings from the initial review have been resolved. The page file `app/app/(protected)/resolution-center/page.tsx` is confirmed to be in the correct location for this project's build process.
- All tasks are verified as complete.
- The implementation aligns with the UX and architectural specifications.

### Acceptance Criteria Coverage:

| AC# | Description | Status | Evidence |
|---|---|---|---|
| 1 | Navigation via `WeatherConflictCard` button | IMPLEMENTED | `app/components/dashboard/WeatherConflictCard.tsx:23-25` |
| 2 | Page structure at `(protected)/resolution-center` | IMPLEMENTED | `app/app/(protected)/resolution-center/page.tsx` (Path correct for project) |
| 3 | Listing of conflicted lessons | IMPLEMENTED | `app/components/dashboard/ResolutionCenter.tsx`, `app/lib/hooks/useManagerDashboard.ts` |
| 4 | Display of conflict details | IMPLEMENTED | `app/components/dashboard/ResolutionConflictItem.tsx` |
| 5 | Resolution action buttons and modals | IMPLEMENTED | `app/components/dashboard/ResolutionConflictItem.tsx` |
| 6 | Responsive Design | IMPLEMENTED | Use of `shadcn/ui` and Tailwind CSS provides a responsive foundation. |
| 7 | UX Alignment with spec 3.4.3 | IMPLEMENTED | The core user journey is implemented as specified. |

### Task Completion Validation:

| Task | Marked As | Verified As | Evidence |
|---|---|---|---|
| Task 1: Create Resolution Center Page | [x] | VERIFIED COMPLETE | `app/app/(protected)/resolution-center/page.tsx` exists. |
| Task 2: Implement Data Fetching | [x] | VERIFIED COMPLETE | `app/lib/hooks/useManagerDashboard.ts` (useResolutionCenterData) |
| Task 3: Build Conflict List UI | [x] | VERIFIED COMPLETE | `app/components/dashboard/ResolutionCenter.tsx` |
| Task 4: Implement Action Buttons/Modals | [x] | VERIFIED COMPLETE | `app/components/dashboard/ResolutionConflictItem.tsx` |
| Task 5: Connect Dashboard to Center | [x] | VERIFIED COMPLETE | `app/components/dashboard/WeatherConflictCard.tsx` |
| Task 6: Testing | [x] | VERIFIED COMPLETE | `app/components/dashboard/__tests__/ResolutionCenter.test.tsx`, `tests/e2e/resolution-center.spec.ts` |

### Test Coverage and Gaps:
- Unit and E2E tests are in place and cover the primary user flow. No significant gaps noted for the scope of this story.

### Action Items:
- None. The story meets all requirements and is ready to be marked as 'done'.

