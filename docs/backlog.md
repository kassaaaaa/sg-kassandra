# Engineering Backlog

This backlog collects cross-cutting or future action items that emerge from reviews and planning.

Routing guidance:

- Use this file for non-urgent optimizations, refactors, or follow-ups that span multiple stories/epics.
- Must-fix items to ship a story belong in that story’s `Tasks / Subtasks`.
- Same-epic improvements may also be captured under the epic Tech Spec `Post-Review Follow-ups` section.

| Date | Story | Epic | Type | Severity | Owner | Status | Notes |
| ---- | ----- | ---- | ---- | -------- | ----- | ------ | ----- |
| 2025-12-12 | 3.5 | 3 | TechDebt | Medium | TBD | Open | Implement true integration tests for the `booking-service` Edge Function, replacing the current mock-based unit tests. [file: supabase/functions/booking-service/__tests__/index.test.ts] |
| 2025-12-11 | 3.4 | 3 | TechDebt | Low | TBD | Open | Consider moving lesson type filtering to backend for performance (AC #3) [file: app/lib/hooks/useManagerCalendar.ts] |
| 2025-12-11 | 3.4 | 3 | Enhancement | Low | TBD | Open | Make calendar start/end hours configurable in school_settings (AC #1) [file: app/components/calendar/ManagerCalendar.tsx] |
| 2025-12-11 | 3.5 | 3 | TechDebt | Medium | TBD | Open | Ensure Notification Service integration is robust once the service is available. (AC #5) |
| 2025-12-11 | 3.5 | 3 | Enhancement | Low | TBD | Open | Consolidate dashboard stats queries into single RPC for performance. [file: app/lib/hooks/useManagerDashboard.ts] |
| 2025-12-11 | 3.5 | 3 | TechDebt | Low | TBD | Open | Improve type safety for data.lesson_types in useLessonTypes. [file: app/lib/hooks/useSchoolData.ts] |
