# Story 1.6: Implement Role-Based Access Control (RBAC)

Status: ready-for-dev

## Story

As a **System Administrator**,
I want **to enforce Role-Based Access Control (RBAC) on both the application routes and the database**,
so that **users can only access the pages and data permitted for their specific role (Guest, Customer, Instructor, Manager)**.

## Acceptance Criteria

1.  **Route Protection (Middleware):** A Next.js middleware intercepts all requests to protected routes (e.g., `/dashboard`, `/calendar`, `/settings`) and redirects unauthenticated users to the `/login` page.
2.  **Role-Based Route Access:** The middleware verifies the user's role (fetched from their session or profile) and redirects authorized users to their destination. (Note: currently both Instructor and Manager access `/dashboard`, but the mechanism must be in place).
3.  **Database Security (RLS - Profiles):** Row Level Security (RLS) is enabled on the `profiles` table. Users can only `SELECT` and `UPDATE` their own profile row.
4.  **Database Security (RLS - Instructor Details):** RLS is enabled on the `instructor_details` table. Instructors can `UPDATE` their own details. Public/Authenticated users can `SELECT` (to view profiles).
5.  **Database Security (RLS - Availability):** RLS is enabled on the `availability` table. Instructors can `INSERT`, `UPDATE`, and `DELETE` their own availability slots.
6.  **Unauthorized Access Redirection:** Attempts to access restricted pages result in a redirection to a safe default (e.g., `/dashboard` or `/login`).

## Tasks / Subtasks

- [ ] Task 1: Implement Next.js Middleware (AC: 1, 2, 6)
  - [ ] Create `middleware.ts` in the project root (`app/middleware.ts`).
  - [ ] Configure `matcher` to apply to protected paths (e.g., `/dashboard/:path*`, `/settings/:path*`).
  - [ ] Implement logic to check for Supabase session using `createMiddlewareClient`.
  - [ ] Implement redirection logic: if no session, redirect to `/login`.
  - [ ] **Test:** Verify redirection locally by attempting to access `/dashboard` without a session.
- [ ] Task 2: Create RLS Policies Migration (AC: 3, 4, 5)
  - [ ] Create a new Supabase migration file `supabase/migrations/<timestamp>_enable_rbac_rls.sql`.
  - [ ] Enable RLS on `profiles`, `instructor_details`, `availability` tables.
  - [ ] Write policy for `profiles`: `allow select, update using (auth.uid() = id)`.
  - [ ] Write policy for `instructor_details`: `allow select`, `allow insert/update using (auth.uid() = user_id)`.
  - [ ] Write policy for `availability`: `allow select`, `allow all using (auth.uid() = instructor_id)`.
  - [ ] **Test:** Verify policies via Supabase dashboard or SQL script by simulating different user IDs.
- [ ] Task 3: Verify RLS & Middleware (Integration Testing)
  - [ ] Create a test script or manual verification steps to confirm:
    - Unauthenticated access to `/dashboard` redirects to `/login`.
    - Authenticated access to `/dashboard` works.
    - User A cannot update User B's profile (via RLS check).

## Dev Notes

- **Middleware Location:** Place `middleware.ts` at the root of the Next.js app (alongside `package.json` and `app/` folder).
- **Supabase Helpers:** Use `@supabase/auth-helpers-nextjs` (or the newer `@supabase/ssr` if updated in dependencies) for middleware. Check `package.json` for installed packages.
- **RLS Best Practices:** Always use `auth.uid()` for secure user identification in policies.
- **Policies:**
  - `profiles`: Users should be able to read their own profile. Managers might need to read all profiles (add policy for Manager role later/now if scope permits, but AC focuses on "own" for now).
  - `availability`: Needs to be readable by scheduling engine (service role) and potentially customers (future). For now, `authenticated` users can read.

### Project Structure Notes

- `middleware.ts` should be at `app/middleware.ts`.
- Migrations go in `supabase/migrations/`.

### References

- **Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-1.md` [Source: docs/sprint-artifacts/tech-spec-epic-1.md]
- **Epics:** `docs/fase-3-solution/epics.md` [Source: docs/fase-3-solution/epics.md]
- **Architecture:** `docs/fase-3-solution/architecture.md` [Source: docs/fase-3-solution/architecture.md]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/1-6-implement-role-based-access-control-rbac.context.xml`

### Agent Model Used

Google Gemini 2.0 Flash (cli)

### Debug Log References

### Completion Notes List

### File List

### Learnings from Previous Story

**From Story 1-5 (Status: done)**

- **AuthService**: `AuthService` is available in `app/lib/auth-service.ts`.
- **Database**: `public.profiles` is populated, so RLS policies can rely on it being present.
- **Testing**: Follow existing patterns in `app/__tests__/`.

[Source: docs/sprint-artifacts/1-5-user-login-and-session-management.md]

## Change Log