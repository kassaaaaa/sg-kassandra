# Story 1.8: Instructor Availability Management

Status: drafted

## Story

As an **Instructor**,
I want **to manage my availability (add, modify, remove time slots, set recurrence)**,
so that **I can prevent scheduling conflicts and ensure customers book lessons only when I am actually free**.

## Acceptance Criteria

(Source: Defined in `docs/sprint-artifacts/tech-spec-epic-1.md` (Story 1.8) and `docs/fase-3-solution/epics.md`.)

1.  **Availability Persistence:** New availability entries are created in the `availability` table upon submission from the calendar UI.
2.  **Visual Feedback:** The calendar view updates immediately to show the new availability slots, styled as per the UX spec (Section 5.2.2).
3.  **Overlap Prevention:** The system prevents the creation of overlapping availability slots for the same instructor, providing an error message if an overlap is attempted (FR008).
4.  **Recurrence Support:** Instructors can set simple recurrence rules (e.g., weekly) for their availability (FR019).

## Tasks / Subtasks

- [ ] Task 1: Implement Availability Service
  - [ ] Create `app/lib/availability-service.ts`.
  - [ ] Implement `getAvailability(instructorId, startDate, endDate)`.
  - [ ] Implement `createAvailability(availabilityData)` with overlap check logic.
  - [ ] Implement `deleteAvailability(availabilityId)`.
  - [ ] Ensure RLS compliance (instructor can only manage their own availability).
- [ ] Task 2: Create Availability Calendar UI
  - [ ] Create `app/app/(protected)/calendar/page.tsx`.
  - [ ] Implement `AvailabilityCalendar` component (Custom or Library) matching UX Spec 5.2.2.
    - [ ] Weekly view.
    - [ ] Navigation (Next/Prev week).
    - [ ] Visual distinction for available vs blocked slots.
  - [ ] Integrate `shadcn/ui` components (Button, Dialog for adding slots).
- [ ] Task 3: Implement Add Availability Modal
  - [ ] Create a form with Date, Start Time, End Time, and Recurrence (Weekly/None).
  - [ ] Use `react-hook-form` and `zod` for validation.
  - [ ] Connect to `AvailabilityService` using TanStack Query (`useMutation`).
- [ ] Task 4: Integrate and Validate
  - [ ] Connect Calendar to `getAvailability` using TanStack Query (`useQuery`).
  - [ ] Handle Optimistic Updates or Invalidate Queries on mutation success.
  - [ ] Show Toast notifications for success/error.
- [ ] Task 5: Automated Testing
  - [ ] Create `tests/e2e/availability.spec.ts`.
  - [ ] Test: Add single slot -> Verify persistence and UI update.
  - [ ] Test: Add overlapping slot -> Verify error message.
  - [ ] Test: Delete slot -> Verify removal.

## Dev Notes

- **Table Schema:** `availability` table (id, instructor_id, start_time, end_time, recurrence_rule).
- **Recurrence:** For MVP, store simple recurrence (e.g., 'WEEKLY') in `recurrence_rule` or keep null for single slots. Complex RRULE parsing might be overkill for MVP, but Tech Spec mentions "iCal RRULE string".
  - *Recommendation*: Use a simple string like `FREQ=WEEKLY` for now if full RRULE library isn't added.
- **Overlap Logic:** PostgreSQL `tsrange` and exclusion constraints are powerful, but application-level check in `AvailabilityService` is required for user feedback.
  - `WHERE instructor_id = $1 AND tsrange(start_time, end_time) && tsrange($2, $3)`
- **UI Component:** If no calendar library is present, a simple CSS Grid week view might suffice for MVP, or install `react-big-calendar`.
- **State Management:** Use `TanStack Query` as established in Story 1.7.

### Learnings from Previous Story

**From Story 1.7 (Status: done)**

- **Service Pattern**: Use `app/lib/availability-service.ts` similar to `profile-service.ts`.
- **State Management**: Use `useQuery` for fetching slots and `useMutation` for updates.
- **Providers**: `QueryClientProvider` is already set up in `providers.tsx`.
- **UI Components**: Continue using `shadcn/ui` (Dialog, Button, Input, Toast).
- **Validation**: Use `zod` schemas for form validation (start time < end time).

[Source: docs/sprint-artifacts/1-7-instructor-profile-management.md]

### References

- **Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-1.md` (Story 1.8)
- **UX Spec:** `docs/fase-2-plan/ux-design-specification.md` (Section 3.4.2, 5.2.2)
- **Architecture:** `docs/fase-3-solution/architecture.md` (Data Architecture)
