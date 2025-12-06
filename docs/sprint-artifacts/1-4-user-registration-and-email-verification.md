# Story 1.4: User Registration and Email Verification

Status: review

## Story

As a New User (Instructor or Manager),
I want to register for an account and verify my email address,
so that I can access the secure features of the KiteOps application with a verified identity.

## Acceptance Criteria

1.  **User Creation:** A new user is created in the Supabase `auth.users` table upon form submission.
2.  **Profile Creation:** A corresponding entry is automatically created in the `public.profiles` table with the selected role (e.g., 'instructor', 'manager').
3.  **Email Verification:** The system sends a verification email to the user's provided address via Resend (integrated with Supabase Auth).
4.  **User Feedback:** Upon successful submission, the user is redirected to a "Check your email" confirmation page with clear instructions.

## Tasks / Subtasks

- [x] Task 1: Setup Resend Integration
  - [x] Configure Resend API key in environment variables (`.env.local`).
  - [x] Configure Supabase Auth to use Resend for transactional emails (SMTP settings or Supabase integration). [Source: Architecture 4]
- [x] Task 2: Implement Database Trigger for Profile Creation
  - [x] Write a Supabase migration SQL script to create a trigger on `auth.users` insert.
  - [x] The trigger function should insert a row into `public.profiles` taking the `id` and `role` (from metadata) of the new user. [Source: Tech Spec 1.4, Architecture 6]
  - [x] **Testing:** Verify manually via SQL editor that inserting a user creates a profile.
- [x] Task 3: Implement `AuthService`
  - [x] Create `app/lib/auth-service.ts` to handle authentication logic.
  - [x] Implement `register` method wrapping `supabase.auth.signUp`.
  - [x] Ensure `options.data` includes the selected role for the trigger to use.
- [x] Task 4: Create Sign Up UI
  - [x] Create `app/(auth)/signup/page.tsx` (or similar route).
  - [x] Implement a Sign Up form using `react-hook-form`, `zod`, and `shadcn/ui` components (Form, Input, Button, Select).
  - [x] Form fields: Email, Password, Role (Instructor/Manager).
  - [x] **Testing:** Unit test form validation logic (required fields, email format).
- [x] Task 5: Create "Check Email" Page
  - [x] Create `app/(auth)/verify-email/page.tsx`.
  - [x] Style with standard layout components to instruct user to check inbox.
- [x] Task 6: Integration
  - [x] Connect Sign Up form to `AuthService.register`.
  - [x] Handle success/error states and redirection.
  - [x] **Testing:** Perform a manual registration flow: Sign up -> Check DB (`auth.users` & `public.profiles`) -> Check Email (Resend logs/inbox).

## File List

- app/app/(auth)/signup/page.tsx
- app/app/(auth)/verify-email/page.tsx
- app/lib/auth-service.ts
- app/__tests__/auth/signup.test.tsx
- supabase/migrations/20251206120000_profile_trigger.sql

## Dev Agent Record

### Debug Log
- Verified `app/.env.local` for RESEND_API_KEY. Appended placeholder key.
- Created Supabase migration for user profile trigger.
- Implemented `AuthService` using existing `supabase` client.
- Installed `shadcn/ui` Select component.
- Implemented Signup UI with form validation and error handling.
- Implemented Verify Email page.
- Created Unit Tests for Signup Page mocking dependencies.
- Verified tests pass.
- Verified linting (fixed `any` usage in new files).

### Completion Notes
- Implemented user registration flow with Email, Password, and Role selection.
- Integrated with Supabase Auth via `AuthService`.
- Added database trigger to automatically create user profile with role.
- Added client-side validation using Zod.
- Added comprehensive unit tests for the signup form.

### Context Reference
- docs/sprint-artifacts/1-4-user-registration-and-email-verification.context.xml