# Story 1.7: Instructor Profile Management

Status: drafted

## Story

As an **Instructor**,
I want **to manage my professional profile (certifications, lesson types)**,
so that **customers can see my qualifications and the system can match me to appropriate lessons**.

## Acceptance Criteria

1.  **Profile Update Persistence:** When an instructor updates their profile information (certifications, lesson types) on the settings page, the changes are persisted to the `instructor_details` table.
2.  **User Feedback:** A success notification (toast) is displayed to the instructor upon successful save.
3.  **Data Validation:** The system accepts valid arrays of text for certifications and lesson types.
4.  **Security:** Instructors can only update their own profile details (enforced by RLS).

## Tasks / Subtasks

- [ ] Task 1: Create Profile Management UI (AC: 1, 3)
  - [ ] Create `app/app/(protected)/settings/profile/page.tsx` (or similar appropriate route).
  - [ ] Implement a form using `react-hook-form` and `zod` schema for `instructor_details` (certifications, lesson_types).
  - [ ] Fetch existing profile data to populate the form on load.
- [ ] Task 2: Implement Profile Update Logic (AC: 1, 4)
  - [ ] Create/Update `ProfileService` (or similar in `lib/db.ts` or `lib/profile-service.ts`) to handle `update` operations on `instructor_details`.
  - [ ] Ensure the update call uses the authenticated user's ID (via RLS context).
- [ ] Task 3: Add User Feedback (AC: 2)
  - [ ] Integrate `shadcn/ui` toast component to show "Profile updated successfully" or error messages.
- [ ] Task 4: Automated Testing (AC: 1, 4)
  - [ ] Implement E2E test in `tests/e2e/profile.spec.ts` (or similar).
  - [ ] Test case: Login as instructor -> Navigate to profile -> Update details -> Verify persistence.
  - [ ] Test case: Verify RLS (implicit in success of update, but explicit negative test covered in 1.6 - verify here that *authorized* update works).

## Dev Notes

- **Table Schema:** `instructor_details` has `certifications` (TEXT[]) and `lesson_types` (TEXT[]).
- **RLS:** Row Level Security is enabled on `instructor_details`. The policy `allow insert/update using (auth.uid() = user_id)` allows instructors to manage their own data.
- **UI Components:** Use existing `shadcn/ui` components (Input, Button, maybe a multi-select or tag input for arrays if available, otherwise comma-separated text input for MVP).
- **Service Layer:** Consider creating a dedicated `lib/profile-service.ts` if `lib/db.ts` is getting crowded, or keep in `db.ts` if simple.

### Learnings from Previous Story

**From Story 1-6 (Status: done)**

- **AuthService**: `AuthService` is available in `app/lib/auth-service.ts`.
- **Middleware**: Routes under `(protected)` are secured, so `/settings/profile` will be safe.
- **RLS Enforcement**: 1-6 implemented and verified the RLS policies. This story relies on them working correctly.
- **Testing**: E2E tests for RLS were a focus. Continue the pattern of robust E2E testing for this feature.
- **Dependencies**: Use `@supabase/ssr` patterns if touching auth/cookies.

[Source: docs/sprint-artifacts/1-6-implement-role-based-access-control-rbac.md]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Gemini 2.0 Flash (cli)

### Debug Log References

### Completion Notes List

### File List
