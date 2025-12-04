# Story 1.4: User Registration and Email Verification

Status: ready-for-dev

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

- [ ] Task 1: Setup Resend Integration
  - [ ] Configure Resend API key in environment variables (`.env.local`).
  - [ ] Configure Supabase Auth to use Resend for transactional emails (SMTP settings or Supabase integration). [Source: Architecture 4]
- [ ] Task 2: Implement Database Trigger for Profile Creation
  - [ ] Write a Supabase migration SQL script to create a trigger on `auth.users` insert.
  - [ ] The trigger function should insert a row into `public.profiles` taking the `id` and `role` (from metadata) of the new user. [Source: Tech Spec 1.4, Architecture 6]
  - [ ] **Testing:** Verify manually via SQL editor that inserting a user creates a profile.
- [ ] Task 3: Implement `AuthService`
  - [ ] Create `app/lib/auth-service.ts` to handle authentication logic.
  - [ ] Implement `register` method wrapping `supabase.auth.signUp`.
  - [ ] Ensure `options.data` includes the selected role for the trigger to use.
- [ ] Task 4: Create Sign Up UI
  - [ ] Create `app/(auth)/signup/page.tsx` (or similar route).
  - [ ] Implement a Sign Up form using `react-hook-form`, `zod`, and `shadcn/ui` components (Form, Input, Button, Select).
  - [ ] Form fields: Email, Password, Role (Instructor/Manager).
  - [ ] **Testing:** Unit test form validation logic (required fields, email format).
- [ ] Task 5: Create "Check Email" Page
  - [ ] Create `app/(auth)/verify-email/page.tsx`.
  - [ ] Style with standard layout components to instruct user to check inbox.
- [ ] Task 6: Integration
  - [ ] Connect Sign Up form to `AuthService.register`.
  - [ ] Handle success/error states and redirection.
  - [ ] **Testing:** Perform a manual registration flow: Sign up -> Check DB (`auth.users` & `public.profiles`) -> Check Email (Resend logs/inbox).

## Dev Notes

- **Security:**
  - Use Zod for strict form validation on the client side.
  - Ensure `role` is passed securely in user metadata.
  - Use Supabase's built-in email verification flow (do not roll your own).
- **Database:**
  - The trigger approach for `profiles` is preferred over client-side creation to guarantee data consistency (AC 1.4.2).
  - Migration file should be placed in `supabase/migrations/`.
- **Environment:**
  - Ensure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `RESEND_API_KEY` are available.
- **UI:**
  - Reuse `LessonCard` style or standard Card component for the registration form container.
  - Follow UX spec for "Success" feedback (redirect to verification page).
- **Coding Standards:**
  - Adhere to `PascalCase` for React components and `kebab-case` for utility classes/files as per `architecture.md` Section 8.
- **Testing Standards:**
  - Follow the layered testing strategy (Unit, Integration, E2E) defined in `architecture.md` and `tech-spec-epic-1.md`.

### Project Structure Notes

- Auth routes should be grouped under `(auth)` to share layout if needed, or just keep them at root if simple. `app/(auth)/...` is a good pattern.
- `AuthService` should be in `app/lib/` to sit alongside `db.ts`.

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Story-1-4-user-registration-and-email-verification-fr002]
- [Source: docs/fase-3-solution/epics.md#Story-1-4-user-registration-and-email-verification]
- [Source: docs/fase-2-plan/PRD.md#FR002]
- [Source: docs/fase-3-solution/architecture.md#Data-Architecture]
- [Source: docs/fase-3-solution/architecture.md#Workflows-and-Sequencing]
- [Source: docs/fase-3-solution/architecture.md#8-implementation-patterns-consistency-rules]

### Learnings from Previous Stories

**From Story 1.3 (Status: done)**

- **New Files Created**:
  - `app/components/LessonCard.tsx`: Custom lesson card component.
  - `app/app/globals.css`: Updated with Tailwind v4 config and custom variables.
  - `app/components/ui/*`: Core shadcn/ui components (Button, Input, Card, etc.).
  - `app/__tests__/components/LessonCard.test.tsx`: Unit tests for LessonCard.
- **Architectural Decisions**:
  - UI components reside in `app/components/ui/`.
  - Custom components like `LessonCard` reside in `app/components/`.
  - Testing uses `vitest` and `react-testing-library`.
- **Warnings/Recommendations**:
  - Ensure new UI components follow the established patterns (shadcn/ui + Tailwind).
  - Use the `cn` utility for class merging.
  - Verify accessibility (aria-labels) for all interactive elements.

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/1-4-user-registration-and-email-verification.context.xml