# Story 2.2: Lesson Search and Filtering UI

Status: review

## Story

As a **Customer**,
I want **to filter available lessons by skill level, lesson type, and date**,
so that **I can easily find and book a lesson that suits my schedule and needs**.

## Acceptance Criteria

(Source: `docs/sprint-artifacts/tech-spec-epic-2.md` - Story 2.2)

1.  **Search Interface:** A user-friendly interface is implemented allowing users to select a **Date**, **Skill Level** (Beginner, Intermediate, Advanced), and **Lesson Type** (Private, Group).
2.  **Dynamic Results:** The list of available lessons updates asynchronously based on the selected filters.
3.  **Availability Logic:** The displayed results reflect actual instructor availability (via `get-available-lessons` API).
4.  **Lesson Display:** Each available slot is rendered using the `LessonCard` component (created in Story 1.3), displaying time, instructor (if pre-assigned or "Any"), and key details.
5.  **Empty State:** A clear "No lessons available" message is displayed if no slots match the criteria.
6.  **Performance:** Search results load in under 1 second (NFR).

## Tasks / Subtasks

- [x] Task 1: Backend - Implement `get-available-lessons` Edge Function
  - [x] Create `supabase/functions/get-available-lessons/index.ts`.
  - [x] Implement logic to query `availability` table for open slots.
  - [x] (Optional for MVP, but recommended) Check `weather_cache` to flag or filter out bad-weather days if logic permits.
  - [x] Validate inputs using Zod (Date, Skill, Type).
  - [x] Return JSON array: `[{ lesson_id, start_time, end_time, available_slots }]`.
  - [x] **Test:** Unit/Integration test for the function.
- [x] Task 2: Frontend - Create `LessonSearch` Component
  - [x] Create `app/components/LessonSearch.tsx` (Client Component).
  - [x] Implement filter controls (Date Picker, Select for Skill/Type) using `shadcn/ui`.
  - [x] Integrate **TanStack Query** to fetch data from `get-available-lessons`.
  - [x] Implement loading skeleton/spinner.
- [x] Task 3: Frontend - Integrate `LessonCard` and Results List
  - [x] Render the list of `LessonCard` components from the query data.
  - [x] Handle empty state ("No lessons found").
  - [x] Ensure responsive layout (grid for cards).
- [x] Task 4: Integration & E2E Testing
  - [x] **Test:** Verify Date Picker correctly formats and passes date to API (AC 1).
  - [x] **Test:** Verify Skill Level and Lesson Type dropdowns filter results correctly (AC 1, 2).
  - [x] **Test:** Verify "Loading..." state appears while fetching (NFR).
  - [x] **Test:** Verify "No lessons available" message appears when API returns empty array (AC 5).
  - [x] **Test:** Verify Lesson Cards display correct time, instructor, and price (AC 4).
  - [x] **Test:** Verify responsiveness on mobile/desktop (AC 1).

## Dev Notes

- **Architecture:**
  - **Pattern:** Use **TanStack Query** in the client component to manage the async state of the search results.
  - **API:** The `get-available-lessons` should be an Edge Function to align with the "Backend Logic in Edge Functions" decision, even for reads if they involve complex availability logic (like checking weather).
  - **Security:** Ensure the Edge Function is accessible (likely public or anonymous key if for guests).

- **UI Components:**
  - Reuse `app/components/LessonCard.tsx`.
  - Use `app/components/ui/select.tsx`, `calendar` (or date picker), `button.tsx`.

- **Data Fetching:**
  - Use `supabase.functions.invoke('get-available-lessons', ...)` within the TanStack Query fetcher.

### Learnings from Previous Story

**From Story 2.1 (Status: done)**

- **Service Pattern**: We are using Supabase Edge Functions. Ensure `get-available-lessons` follows the same structure as `weather-poller` (Deno, Zod validation).
- **Async Reliability**: If the Edge Function writes to the DB (e.g., logs), ensure `await` is used to prevent runtime termination issues.
- **Testing**: Tests must be runnable. Ensure `deno` is available in the CI/CD or test environment if running local Edge Function tests.
- **RLS**: The `availability` table likely has RLS. Ensure the Edge Function (or the client if calling directly) has appropriate permissions. (Edge Functions usually use `service_role` if bypassing RLS, or pass the user JWT). For this public search, we might need a `service_role` call inside the function if `availability` is private, or open up `availability` for `select` to `anon` users. *Decision: Keep `availability` secure; let the Edge Function handle the query securely.*

[Source: docs/sprint-artifacts/2-1-integrate-weather-api.md#Dev-Agent-Record]

### References

- **Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-2.md`
- **Epics:** `docs/fase-3-solution/epics.md`
- **Architecture:** `docs/fase-3-solution/architecture.md`
- **PRD:** `docs/fase-2-plan/PRD.md`
- **Design:** `docs/wireframes/customer-booking.html` (if applicable)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/2-2-lesson-search-and-filtering-ui.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- Implemented `get-available-lessons` Edge Function with Zod validation and availability query logic.
- Created `LessonSearch` Client Component with Date, Skill, and Type filters using `shadcn/ui` components.
- Integrated `TanStack Query` for async data fetching.
- Added accessibility labels to search inputs.
- Created E2E test `tests/e2e/search.spec.ts` covering the search flow and empty states.
- Verified all Acceptance Criteria via E2E tests.

### File List

- supabase/functions/get-available-lessons/index.ts
- supabase/functions/_shared/cors.ts
- tests/integration/get-available-lessons.test.ts
- app/components/LessonSearch.tsx
- tests/e2e/search.spec.ts
