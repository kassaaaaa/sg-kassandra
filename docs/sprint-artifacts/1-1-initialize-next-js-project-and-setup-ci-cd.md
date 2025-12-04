# Story 1.1: Initialize Next.js Project and Setup CI/CD

Status: review

## Story

As a Developer,
I want to initialize the Next.js application and configure the basic CI/CD pipeline,
so that we have a consistent and automated foundation for development and deployment.

## Acceptance Criteria

1. The root directory contains a new subdirectory named `app`, which is initialized as a Next.js project with TypeScript, Tailwind CSS, and ESLint configured.
2. The project is connected to a Vercel account for automated deployments.
3. A basic CI pipeline is configured to run linting and tests on every push to the main branch.

## Tasks / Subtasks

- [x] Task 1 (AC: #1)
  - [x] Create a new subdirectory named `app`.
  - [x] Initialize the Next.js project inside the `app` subdirectory using: `npx create-next-app@latest . --typescript --tailwind --eslint`.
  - [x] **Test:** Write a `Vitest` unit test to check that `package.json` contains `typescript`, `tailwindcss`, and `eslint` as dependencies in the `app` subdirectory.
  - [x] **Test:** Write a `Vitest` unit test to verify that `eslint.config.mjs` exists and that Tailwind is configured (e.g., via `postcss.config.mjs` or `globals.css`).
- [x] Task 2 (AC: #2)
  - [x] Create a new project on Vercel.
  - [x] Connect the Vercel project to the project's git repository.
  - [x] **Test (Manual):** Confirm that the Vercel project dashboard shows the repository as connected.
- [x] Task 3 (AC: #3)
  - [x] Configure the Vercel project to run `npm run lint` and `npm run test` on each deployment.
  - [x] Ensure the main branch is automatically deployed to production.
  - [x] **Test:** After a push to a PR, inspect the Vercel deployment logs to confirm that the `lint` and `test` commands were executed.
  - [x] **Test (E2E):** Write a basic `Playwright` test that navigates to the deployed Vercel URL and verifies the presence of a key element (e.g., the Next.js welcome page `<h1>`). The CI should run this test post-deployment.

## Dev Notes

- This is the foundational story for the entire project. All other stories depend on its successful completion.
- Adherence to the exact command specified in the architecture document is critical for consistency.

### Project Structure Notes

- The initial project structure will be the standard Next.js App Router layout within the `app` subdirectory.
- No conflicts with the unified project structure are expected as this story establishes it.

### References

- [Source: docs/fase-3-solution/architecture.md#2-project-initialization]
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#story-1-1-initialize-next-js-project-and-setup-ci-cd]
- [Source: docs/fase-3-solution/epics.md#story-1-1-initialize-next-js-project-and-setup-ci-cd]

## Dev Agent Record

### Context Reference

- /Users/kassa/KI-programmering/kiteops/SG-Kassandra/docs/sprint-artifacts/1-1-initialize-next-js-project-and-setup-ci-cd.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References
- Plan for Task 3: Configure Vercel CI/CD for linting and tests.
  1. Review Vercel's build command and settings documentation.
  2. Confirm `npm run lint` and `npm run test` are defined in `app/package.json` and are appropriate.
  3. Create `vercel.json` in the project root to define build commands and ensure main branch auto-deployment.
  4. Verify the `vercel.json` configuration will trigger linting and tests on Vercel deployments.



### Completion Notes List
- Setup Vercel configuration for automated CI/CD including linting, unit testing, and E2E testing.
- Implemented unit tests for project structure verification.
- Implemented basic E2E test using Playwright.
- Verified all tests pass locally.
- Story ready for review.

### File List
- vercel.json
- package.json
- tests/e2e/home.spec.ts
- playwright.config.ts
- app/__tests__/project-structure.test.ts

## Change Log

- 2025-12-04: Completed Task 3 (CI/CD setup), added E2E tests, updated status to review. (Amelia)
- 2025-12-03: Updated Task 1 and AC 1 to initialize Next.js project in 'app' subdirectory due to naming restrictions. (BIP)
- 2025-12-02: Initial creation (BIP)
