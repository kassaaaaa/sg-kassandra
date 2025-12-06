# Story 1.5: User Login and Session Management

Status: drafted

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

- [ ] Task 1: Update `AuthService`
  - [ ] Add `login(email, password)` method to `app/lib/auth-service.ts` wrapping `supabase.auth.signInWithPassword`.
  - [ ] Add `logout()` method for completeness (even if UI not fully ready, good to have logic).
  - [ ] Add `getUserRole()` helper to fetch `public.profiles.role` for the current user to support redirection.
- [ ] Task 2: Create Login UI
  - [ ] Create `app/app/(auth)/login/page.tsx`.
  - [ ] Implement Login form using `react-hook-form`, `zod`, and `shadcn/ui` components (Form, Input, Button).
  - [ ] Form fields: Email, Password.
  - [ ] Add "Sign Up" link for users who don't have an account.
  - [ ] **Testing:** Unit test form validation logic.
- [ ] Task 3: Implement Redirection Logic
  - [ ] In the Login page submit handler, after successful auth, fetch the user's role using `AuthService` (or direct DB call if service wrapper is thin).
  - [ ] specific dashboard routes:
    - Instructor -> `/dashboard` (Instructor Dashboard - Story 3.1)
    - Manager -> `/dashboard` (Manager Dashboard - Story 3.2)
    *   *Decision:* Since both share `/dashboard` in early implementation or might differ, logic should be extensible. For now, redirect both to `/dashboard`.
- [ ] Task 4: Integration & Error Handling
  - [ ] Handle `AuthApiError` and display appropriate messages (e.g., "Invalid login credentials").
  - [ ] **Testing:** Manual verification of login flow (valid/invalid credentials).

## Dev Notes

- **Architecture Pattern:** Continue using `AuthService` facade for Supabase interactions.
- **Security:** Ensure no sensitive user data (like password hash) is exposed to the client beyond what Supabase handles safely.
- **Supabase Auth:** `signInWithPassword` returns a session object. This session is automatically persisted to local storage by the Supabase client.

### Learnings from Previous Story

**From Story 1-4 (Status: done)**

- **New Service Created**: `AuthService` available at `app/lib/auth-service.ts` - extend this file.
- **UI Pattern**: Login form should match the style and structure of the Signup form (`app/app/(auth)/signup/page.tsx`) for consistency.
- **Testing**: Follow the testing pattern established in `app/__tests__/auth/signup.test.tsx`.
- **Database**: `public.profiles` is now populated via trigger, so `role` lookups are reliable.

[Source: docs/sprint-artifacts/1-4-user-registration-and-email-verification.md]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Google Gemini 2.0 Flash (cli)

### Debug Log References

### Completion Notes List

### File List
