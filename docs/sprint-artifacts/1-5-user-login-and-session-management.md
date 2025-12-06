# Story 1.5: User Login and Session Management

Status: review

## Story

As a Registered User (Instructor or Manager),
I want to log in to the application using my email and password,
so that I can access my personalized dashboard and manage my school activities securely.

## Acceptance Criteria

1.  **Authentication:** Users can successfully log in using valid credentials (email and password).
2.  **Role-Based Redirection:** Upon successful login, the user is automatically redirected to their role-specific dashboard (e.g., `/dashboard` for Instructors/Managers vs. specific routes).
    *   *Note: For this epic, Instructors and Managers both go to `/dashboard` initially, or we strictly implement the split now if defined.*
    *   *Refinement:* Tech Spec says "redirected to their role-specific dashboard".
3.  **Session Persistence:** The user's session is maintained across browser refreshes/reloads (handled by Supabase Auth).
4.  **Error Handling:** Incorrect login attempts (wrong password, user not found) display a clear, user-friendly error message.
5.  **Form Validation:** The login form validates input (email format, required fields) before submission.

## Tasks / Subtasks

- [x] Task 1: Update `AuthService` (AC: 1)
  - [x] Add `login(email, password)` method to `app/lib/auth-service.ts` wrapping `supabase.auth.signInWithPassword`.
  - [x] Add `logout()` method for completeness (even if UI not fully ready, good to have logic).
  - [x] Add `getUserRole()` helper to fetch `public.profiles.role` for the current user to support redirection.
- [x] Task 2: Create Login UI (AC: 1, 4, 5)
  - [x] Create `app/app/(auth)/login/page.tsx`.
  - [x] Implement Login form using `react-hook-form`, `zod`, and `shadcn/ui` components (Form, Input, Button).
  - [x] Form fields: Email, Password.
  - [x] Add "Sign Up" link for users who don't have an account.
  - [x] **Testing:** Unit test form validation logic.
- [x] Task 3: Implement Redirection Logic (AC: 2)
  - [x] In the Login page submit handler, after successful auth, fetch the user's role using `AuthService` (or direct DB call if service wrapper is thin).
  - [x] specific dashboard routes:
    - Instructor -> `/dashboard` (Instructor Dashboard - Story 3.1)
    - Manager -> `/dashboard` (Manager Dashboard - Story 3.2)
    *   *Decision:* Since both share `/dashboard` in early implementation or might differ, logic should be extensible. For now, redirect both to `/dashboard`.
- [x] Task 4: Integration & Error Handling (AC: 3, 4)
  - [x] Handle `AuthApiError` and display appropriate messages (e.g., "Invalid login credentials").
  - [x] **Testing:** Manual verification of login flow (valid/invalid credentials).

## Dev Notes

- **Architecture Pattern:** Continue using `AuthService` facade for Supabase interactions.
- **Security:** Ensure no sensitive user data (like password hash) is exposed to the client beyond what Supabase handles safely.
- **Supabase Auth:** `signInWithPassword` returns a session object. This session is automatically persisted to local storage by the Supabase client.

### References
- **Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-1.md` [Source: docs/sprint-artifacts/tech-spec-epic-1.md]
- **Epics:** `docs/fase-3-solution/epics.md` [Source: docs/fase-3-solution/epics.md]
- **Architecture:** `docs/fase-3-solution/architecture.md` [Source: docs/fase-3-solution/architecture.md]

### Project Structure Notes
- Follow the pattern in `docs/sprint-artifacts/1-4-user-registration-and-email-verification.md` regarding `app/app/(auth)/` directory structure.

### Learnings from Previous Story

**From Story 1-4 (Status: done)**

- **New Service Created**: `AuthService` available at `app/lib/auth-service.ts` - extend this file.
- **UI Pattern**: Login form should match the style and structure of the Signup form (`app/app/(auth)/signup/page.tsx`) for consistency.
- **Testing**: Follow the testing pattern established in `app/__tests__/auth/signup.test.tsx`.
- **Database**: `public.profiles` is now populated via trigger, so `role` lookups are reliable.

[Source: docs/sprint-artifacts/1-4-user-registration-and-email-verification.md]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-5-user-login-and-session-management.context.xml

### Agent Model Used

Google Gemini 2.0 Flash (cli)

### Debug Log References

### Completion Notes List
- Implemented `login`, `logout`, and `getUserRole` in `AuthService`.
- Created `LoginPage` with form validation and error handling using `sonner`.
- Implemented role-based redirection logic (currently pointing to `/dashboard` for both roles as per spec).
- Added comprehensive unit tests for `LoginPage`.

### File List
- app/lib/auth-service.ts
- app/app/(auth)/login/page.tsx
- app/__tests__/auth/login.test.tsx
