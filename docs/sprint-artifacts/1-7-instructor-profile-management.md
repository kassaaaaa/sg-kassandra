# Story 1.7: Instructor Profile Management

Status: review

## Story

As an **Instructor**,
I want **to manage my professional profile (certifications, lesson types)**,
so that **customers can see my qualifications and the system can match me to appropriate lessons**.

## Acceptance Criteria

(Source: Defined in `docs/fase-3-solution/epics.md` (Story 1.7) and refined with technical details from `docs/fase-3-solution/architecture.md` (Data Architecture).)

1.  **Profile Update Persistence:** When an instructor updates their profile information (certifications, lesson types) on the settings page, the changes are persisted to the `instructor_details` table.
2.  **User Feedback:** A success notification (toast) is displayed to the instructor upon successful save.
3.  **Data Validation:** The system accepts valid arrays of text for certifications and lesson types.
4.  **Security:** Instructors can only update their own profile details (enforced by RLS).

## Tasks / Subtasks

- [x] Task 1: Create Profile Management UI (AC: 1, 3)
  - [x] Create `app/app/(protected)/settings/profile/page.tsx` (or similar appropriate route).
  - [x] Implement a form using `react-hook-form` and `zod` schema for `instructor_details` (certifications, lesson_types).
  - [x] Fetch existing profile data to populate the form on load.
  - [x] Task 2: Implement Profile Update Logic (AC: 1, 4)
    - [x] Create/Update `ProfileService` (or similar in `lib/db.ts` or `lib/profile-service.ts`) to handle `update` operations on `instructor_details`.
    - [x] Ensure the update call uses the authenticated user's ID (via RLS context).
    - [x] Task 3: Add User Feedback (AC: 2)
    - [x] Integrate `shadcn/ui` toast component to show "Profile updated successfully" or error messages.
    - [x] Task 4: Automated Testing (AC: 1, 2, 3, 4)
    - [x] Implement E2E test in `tests/e2e/profile.spec.ts` (or similar).
    - [x] Test case: Login as instructor -> Navigate to profile -> Update details -> Verify persistence (AC 1).
    - [x] Test case: Verify User Feedback: Toast appears on success (AC 2).
    - [x] Test case: Verify Data Validation: Invalid inputs are rejected (AC 3).
    - [x] Test case: Verify RLS (implicit in success of update, but explicit negative test covered in 1.6 - verify here that *authorized* update works) (AC 4).

### Review Follow-ups (AI)

- [ ] [AI-Review][High] Uncomment and fix assertions in `tests/e2e/profile.spec.ts` to actually verify persistence, feedback, and validation (AC 1, 2, 3).
- [ ] [AI-Review][Med] Refactor data fetching in `page.tsx` to use TanStack Query instead of `useEffect`.
- [ ] [AI-Review][Low] Enhance Zod schema in `page.tsx` to ensure `certifications` and `lesson_types` are not empty strings if that is the intent.
- **2025-12-06**: Senior Developer Review notes appended.

## Dev Notes

- **Table Schema:** `instructor_details` has `certifications` (TEXT[]) and `lesson_types` (TEXT[]).
- **RLS:** Row Level Security is enabled on `instructor_details`. The policy `allow insert/update using (auth.uid() = user_id)` allows instructors to manage their own data.
- **UI Components:** Use existing `shadcn/ui` components (Input, Button, maybe a multi-select or tag input for arrays if available, otherwise comma-separated text input for MVP).
- **Service Layer:** Consider creating a dedicated `lib/profile-service.ts` if `lib/db.ts` is getting crowded, or keep in `db.ts` if simple.

### References

- **Epics:** `docs/fase-3-solution/epics.md` (Section: Epic 1 > Story 1.7) [Source: docs/fase-3-solution/epics.md]
- **Architecture:** `docs/fase-3-solution/architecture.md` (Sections: Data Architecture, Security) [Source: docs/fase-3-solution/architecture.md]

### Learnings from Previous Story

**From Story 1-6 (Status: done)**

- **AuthService**: `AuthService` is available in `app/lib/auth-service.ts`.
- **Middleware**: Routes under `(protected)` are secured, so `/settings/profile` will be safe.
- **RLS Enforcement**: 1-6 implemented and verified the RLS policies. This story relies on them working correctly.
- **Testing**: E2E tests for RLS were a focus. Continue the pattern of robust E2E testing for this feature.
- **Dependencies**: Use `@supabase/ssr` patterns if touching auth/cookies.

[Source: docs/sprint-artifacts/1-6-implement-role-based-access-control-rbac.md]

## Senior Developer Review (AI)

- **Reviewer**: BIP
- **Date**: Saturday, December 6, 2025
- **Outcome**: **CHANGES REQUESTED**
- **Justification**: The critical testing issue has been resolved, but there are still architecture alignment and minor validation issues that need to be addressed before approval.

### Summary
The core UI and database logic implementation is correct, and the E2E tests now properly verify the functionality. However, the implementation deviates from the architectural standard by not using TanStack Query for state management, and the Zod schema for validation could be strengthened.

### Key Findings

- **[Medium] Architecture Violation (State Management)**: The implementation uses `useEffect` and `useState` for data fetching, whereas `architecture.md` explicitly specifies **TanStack Query** for server state management.
- **[Low] Missing Service Layer**: Task 2 mentioned creating `ProfileService`, but logic was implemented inline in the page component.
- **[Low] Weak Validation**: The Zod schema allows empty or arbitrary strings without robust validation for certifications and lesson types.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
| :--- | :--- | :--- | :--- |
| 1 | Profile Update Persistence | **VERIFIED COMPLETE** | `tests/e2e/profile.spec.ts` |
| 2 | User Feedback (Toast) | **VERIFIED COMPLETE** | `tests/e2e/profile.spec.ts` (console log check) |
| 3 | Data Validation | **PARTIAL** | Basic schema exists; `tests/e2e/profile.spec.ts` (empty values pass) |
| 4 | Security (RLS) | **VERIFIED COMPLETE** | `page.tsx` uses `auth.uid()`; relies on backend RLS (verified in Story 1.6). |

**Summary**: 3 of 4 acceptance criteria fully verified, 1 partially verified.

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
| :--- | :--- | :--- | :--- |
| Task 1: Create Profile Management UI | [x] | **VERIFIED COMPLETE** | `page.tsx` exists and renders form. |
| Task 2: Implement Profile Update Logic | [x] | **VERIFIED COMPLETE** | Logic exists in `page.tsx`. |
| Task 3: Add User Feedback | [x] | **VERIFIED COMPLETE** | Toast integration present. |
| Task 4: Automated Testing | [x] | **VERIFIED COMPLETE** | `tests/e2e/profile.spec.ts` (assertions uncommented and passing). |

**Summary**: 4 of 4 completed tasks verified.

### Test Coverage and Gaps
- **Improved**: E2E tests (`tests/e2e/profile.spec.ts`) now have active assertions and are passing.
- **Gap**: Additional E2E test cases could be added for stricter data validation (AC3) if the Zod schema is enhanced.

### Architectural Alignment
- **Violation**: Uses `useEffect` instead of TanStack Query for server state management.
- **Compliance**: Uses Supabase Client, shadcn/ui, and Tailwind properly.

### Security Notes
- RLS usage appears correct (using `auth.uid()` in query).
- Route protection relies on middleware (assumed correct from Context).

### Best-Practices and References
- **State Management**: Adopt [TanStack Query](https://tanstack.com/query/latest) for server state to match architecture.
- **Service Layer**: Consider extracting DB logic to `lib/profile-service.ts` for better separation of concerns.

### Action Items

**Code Changes Required:**
- [ ] [Med] Refactor data fetching in `page.tsx` to use TanStack Query instead of `useEffect` [file: app/app/(protected)/settings/profile/page.tsx]
- [ ] [Low] Enhance Zod schema in `page.tsx` to ensure `certifications` and `lesson_types` are not empty strings if that is the intent [file: app/app/(protected)/settings/profile/page.tsx]
- [ ] [Low] Create a dedicated `lib/profile-service.ts` to encapsulate profile update logic [file: app/lib/profile-service.ts]

**Advisory Notes:**
- Note: Consider adding more robust validation (e.g., specific regex patterns or predefined lists) for certifications and lesson types.
