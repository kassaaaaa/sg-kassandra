# Story 1.2: Setup Supabase Backend and Schema

Status: ready-for-dev

## Story

As a Developer,
I want to set up the Supabase backend, define the initial database schema with Row Level Security (RLS), and configure the Supabase client in the Next.js application,
so that we have a secure and structured foundation for data persistence and authentication.

## Acceptance Criteria

1. The `profiles`, `lessons`, `bookings`, `availability`, `instructor_details`, `customer_details`, and `instructor_lesson_types` tables are created in the Supabase database as per the architecture.
2. Row Level Security (RLS) is enabled on all created tables with a default "deny all" policy for public access.
3. The Supabase client is configured and exported from `app/lib/db.ts`.
4. Environment variables for Supabase URL and Anon Key are configured in `.env.local` (and documented in `.env.example`).

## Tasks / Subtasks

- [ ] Task 1 (AC: #3, #4)
  - [ ] Install `@supabase/supabase-js` version `2.86.0` in the `app` directory.
  - [ ] Create `.env.example` in the `app` root with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - [ ] Create `app/lib/db.ts` to initialize and export the Supabase client using the environment variables.
  - [ ] **Test:** Write a Vitest unit test for `app/lib/db.ts` to ensure it throws an error if env vars are missing and exports a client instance.
- [ ] Task 2 (AC: #1, #2)
  - [ ] Create a `supabase/migrations` directory in the project root.
  - [ ] Create a migration file `supabase/migrations/20251204000000_initial_schema.sql`.
  - [ ] Define the SQL for `profiles`, `lessons`, `bookings`, `availability`, `instructor_details`, `customer_details`, and `instructor_lesson_types`.
  - [ ] Include `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` for all tables.
  - [ ] Include generic policies (e.g., `CREATE POLICY "Deny Public Access" ON ... FOR ALL USING (false);`) to satisfy the "default deny" requirement until specific policies are added in later stories.
- [ ] Task 3 (Verify)
  - [ ] **Test (Integration):** Create a script `scripts/test-supabase-connection.ts` (or a test file `tests/integration/supabase.test.ts`) that uses the client to perform a simple query (e.g., `supabase.from('profiles').select('count', { count: 'exact', head: true })`) to verify connectivity and valid credentials. *Note: Requires a running Supabase instance or mock.*

## Dev Notes

- **Schema Source of Truth:** Refer to `docs/fase-3-solution/architecture.md` Section 6 for the table definitions.
- **RLS Strategy:** Start with restrictive policies. We will open them up in Story 1.6 (RBAC).
- **Client Initialization:** Ensure the client is a singleton or initialized correctly to avoid connection exhaustion, though `supabase-js` handles this well.
- **Project Structure:** The `supabase` folder should be at the project root, peer to `app/`.

### Project Structure Notes

- **New Directory:** `supabase/` at project root.
- **New File:** `app/lib/db.ts` aligns with `lib/` folder convention established in Architecture.

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#story-1-2-setup-supabase-backend-and-schema]
- [Source: docs/fase-3-solution/architecture.md#6-data-architecture]
- [Source: docs/fase-3-solution/epics.md]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-2-setup-supabase-backend-and-schema.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

### Learnings from Previous Story

**From Story 1.1 (Status: done)**

- **Structure:** The Next.js application lives in the `app` subdirectory. All `npm install` commands must be run within `app/`.
- **Testing:** E2E tests are in `tests/e2e/` (project root), while unit tests are in `app/__tests__/`.
- **CI/CD:** GitHub Actions (`.github/workflows/ci.yml`) will run tests on push. Ensure new tests are picked up by this workflow.
- **Linting:** ESLint is configured; ensure `lib/db.ts` and new files adhere to rules.

[Source: docs/sprint-artifacts/1-1-initialize-next-js-project-and-setup-ci-cd.md#Dev-Agent-Record]

## Change Log

- 2025-12-04: Initial creation (BIP)
