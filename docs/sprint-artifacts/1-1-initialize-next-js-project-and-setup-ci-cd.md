# Story 1.1: Initialize Next.js Project and Setup CI/CD

Status: ready-for-dev

## Story

As a Developer,
I want to initialize the Next.js application and configure the basic CI/CD pipeline,
so that we have a consistent and automated foundation for development and deployment.

## Acceptance Criteria

1. The root directory contains a new subdirectory named `app`, which is initialized as a Next.js project with TypeScript, Tailwind CSS, and ESLint configured.
2. The project is connected to a Vercel account for automated deployments.
3. A basic CI pipeline is configured to run linting and tests on every push to the main branch.

## Tasks / Subtasks

- [ ] Task 1 (AC: #1)
  - [ ] Create a new subdirectory named `app`.
  - [ ] Initialize the Next.js project inside the `app` subdirectory using: `npx create-next-app@latest . --typescript --tailwind --eslint`.
  - [ ] **Test:** Write a `Vitest` unit test to check that `package.json` contains `typescript`, `tailwindcss`, and `eslint` as dependencies in the `app` subdirectory.
  - [ ] **Test:** Write a `Vitest` unit test to verify that `tailwind.config.ts` and `.eslintrc.json` files exist at the root of the `app` subdirectory.
- [ ] Task 2 (AC: #2)
  - [ ] Create a new project on Vercel.
  - [ ] Connect the Vercel project to the project's git repository.
  - [ ] **Test (Manual):** Confirm that the Vercel project dashboard shows the repository as connected.
- [ ] Task 3 (AC: #3)
  - [ ] Configure the Vercel project to run `npm run lint` and `npm run test` on each deployment.
  - [ ] Ensure the main branch is automatically deployed to production.
  - [ ] **Test:** After a push to a PR, inspect the Vercel deployment logs to confirm that the `lint` and `test` commands were executed.
  - [ ] **Test (E2E):** Write a basic `Playwright` test that navigates to the deployed Vercel URL and verifies the presence of a key element (e.g., the Next.js welcome page `<h1>`). The CI should run this test post-deployment.

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

### Completion Notes List

### File List

## Change Log

- 2025-12-03: Updated Task 1 and AC 1 to initialize Next.js project in 'app' subdirectory due to naming restrictions. (BIP)
- 2025-12-02: Initial creation (BIP)
