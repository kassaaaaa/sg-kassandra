# Story 2.2: Lesson Search and Filtering UI

Status: drafted

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

- [ ] Task 1: Backend - Implement `get-available-lessons` Edge Function
  - [ ] Create `supabase/functions/get-available-lessons/index.ts`.
  - [ ] Implement logic to query `availability` table for open slots.
  - [ ] (Optional for MVP, but recommended) Check `weather_cache` to flag or filter out bad-weather days if logic permits.
  - [ ] Validate inputs using Zod (Date, Skill, Type).
  - [ ] Return JSON array: `[{ lesson_id, start_time, end_time, available_slots }]`.
  - [ ] **Test:** Unit/Integration test for the function.
- [ ] Task 2: Frontend - Create `LessonSearch` Component
  - [ ] Create `app/components/LessonSearch.tsx` (Client Component).
  - [ ] Implement filter controls (Date Picker, Select for Skill/Type) using `shadcn/ui`.
  - [ ] Integrate **TanStack Query** to fetch data from `get-available-lessons`.
  - [ ] Implement loading skeleton/spinner.
- [ ] Task 3: Frontend - Integrate `LessonCard` and Results List
  - [ ] Render the list of `LessonCard` components from the query data.
  - [ ] Handle empty state ("No lessons found").
  - [ ] Ensure responsive layout (grid for cards).
- [ ] Task 4: Integration & E2E Testing
  - [ ] Verify the flow: Select Filter -> Loading -> Results appear.
  - [ ] Verify "No results" case.

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
- **Design:** `docs/wireframes/customer-booking.html` (if applicable)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
