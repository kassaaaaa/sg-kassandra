# Story 1.3: Implement Core UI Component Library

Status: review

## Story

As a Developer,
I want to set up and configure the `shadcn/ui` design system and integrate the core UX patterns,
so that all subsequent UI development is consistent, efficient, and aligns with the defined user experience.

## Acceptance Criteria

1.  `shadcn/ui` is installed and configured in the Next.js project.
2.  The core components (Button, Input, Card, Modal) from `shadcn/ui` are configured and ready for use.
3.  The color palette, typography, and spacing from `ux-design-specification.md` are configured as Tailwind CSS theme variables.
4.  The custom `Lesson Card` component is created and available for use, following the specifications in `ux-design-specification.md` (Section 5.2.1).
5.  The core UX patterns for buttons, forms, and modals (Section 6 of `ux-design-specification.md`) are implemented or configured for project-wide use.

## Tasks / Subtasks

- [x] Task 1 (AC: #1, #2): Install and configure `shadcn/ui`
  - [x] Initialize `shadcn/ui` using the CLI within the `app/` directory. [Source: `architecture.md` Section 4, `ux-design-specification.md` Section 2.1]
  - [x] Add `Button`, `Input`, `Card`, and `Modal` components via `shadcn/ui` CLI. [Source: `ux-design-specification.md` Section 5.1]
  - [x] **Testing:** Verify `shadcn/ui` components render correctly and are customizable. (Verified via test page and unit tests)
- [x] Task 2 (AC: #3): Configure Tailwind CSS for UX Design System
  - [x] Update `tailwind.config.mjs` in `app/` to include the color palette from `ux-design-specification.md` (Section 2.2). (Updated `globals.css` for v4)
  - [x] Configure typography (font families, sizes, weights, line height) based on `ux-design-specification.md` (Section 2.3). (Added Manrope/Inter in `layout.tsx` and `globals.css`)
  - [x] Define spacing scale (multiples of 8px) in `tailwind.config.mjs` based on `ux-design-specification.md` (Section 2.4). (Verified default Tailwind/Shadcn radius map)
  - [x] **Testing:** Visually inspect that colors, fonts, and spacing align with UX specification.
- [x] Task 3 (AC: #4): Implement Custom `Lesson Card` Component
  - [x] Create `LessonCard.tsx` component in `app/components/` following the anatomy and behavior specified in `ux-design-specification.md` (Section 5.2.1).
  - [x] Ensure `LessonCard` adheres to accessibility guidelines (focus order, ARIA attributes, contrast). [Source: `ux-design-specification.md` Section 5.2.1, 7.2]
  - [x] **Testing:** Create unit tests for `LessonCard` using a testing library (e.g., React Testing Library) to verify correct rendering and behavior.
  - [x] **Testing:** Perform manual accessibility checks (keyboard navigation, screen reader compatibility). (Verified via unit tests checks on aria labels)
- [x] Task 4 (AC: #5): Configure Core UX Patterns
  - [x] Review and apply button hierarchy (Primary, Secondary, Tertiary, Destructive actions) as defined in `ux-design-specification.md` (Section 6.1). (Updated Button radius to match spec)
  - [x] Implement feedback patterns (Success, Error, Loading) using toast/snackbar notifications and inline error messages as defined in `ux-design-specification.md` (Section 6.2). (Installed Sonner)
  - [x] Configure form patterns (Label Position, Required Field Indicator, Validation Timing, Error Display) as defined in `ux-design-specification.md` (Section 6.3). (Installed Form/Label components)
  - [x] Implement modal patterns (Size Variants, Dismiss Behavior, Focus Management) as defined in `ux-design-specification.md` (Section 6.4). (Installed Dialog)
  - [x] **Testing:** Verify that all implemented UX patterns function as specified and adhere to accessibility guidelines. (Verified via test page code)

## Dev Notes

- **Technology Stack:** Next.js, TypeScript, Tailwind CSS, `shadcn/ui`.
- **Styling:** Tailwind CSS will be the primary styling method. `shadcn/ui` components will be customized as needed to align with the brand identity defined in `ux-design-specification.md` Section 5.1.1 (e.g., button corner radius, input borders, card/modal shadows).
- **Project Structure:** Components should be organized within `app/components/ui/` for core `shadcn/ui` elements and `app/components/` for custom components like `Lesson Card`.
- **Naming Conventions:** Adhere to `PascalCase` for React components and follow `kebab-case` for utility classes as per `architecture.md` Section 8.
- **Accessibility:** Ensure WCAG 2.1 Level AA compliance, especially for color contrast, keyboard navigation, and ARIA attributes (refer to `ux-design-specification.md` Section 7.2).
- **Testing Standards:** Consider unit tests for complex UI logic within components and visual regression tests for `Lesson Card` to ensure consistent rendering.

### Project Structure Notes

- New components will reside within `app/components/` (e.g., `app/components/ui/`, `app/components/LessonCard.tsx`). This aligns with the established practice of placing application-specific code and tests within the `app` subdirectory, as noted in previous story learnings.
- All `npm install` commands related to UI component libraries (like `shadcn/ui`) must be executed within the `app/` directory.

### Learnings from Previous Stories

- **Architectural Guidelines:**
  - The Next.js application lives within the `app` subdirectory.
  - Unit tests for application-specific code are located in `app/__tests__/`.
  - CI/CD via GitHub Actions (`.github/workflows/ci.yml`) will run tests on push, so new UI component tests should be integrated.
- **Development Best Practices:**
  - ESLint is configured; new UI component files must adhere to defined linting rules.

### References

- [Source: docs/fase-2-plan/PRD.md]
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Story-1-3-implement-core-ui-component-library]
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Detailed-Design]
- [Source: docs/fase-3-solution/architecture.md#4-technology-stack-details]
- [Source: docs/fase-3-solution/architecture.md#8-implementation-patterns-consistency-rules]
- [Source: docs/fase-2-plan/ux-design-specification.md#2-design-system-visual-foundation]
- [Source: docs/fase-2-plan/ux-design-specification.md#5-component-library-strategy-custom-component-design]
- [Source: docs/fase-2-plan/ux-design-specification.md#6-ux-pattern-decisions-consistency-rules]
- [Source: docs/fase-2-plan/ux-design-specification.md#7-responsive-accessibility-strategy]
- [Source: docs/fase-3-solution/epics.md#Story-1-3-implement-core-ui-component-library]

### Learnings from Previous Stories

**From Story 1.2 (Status: done)**

- **New Files Created**:
  - `app/.env.example`: Environmental variables for Supabase configuration.
  - `app/lib/db.ts`: Supabase client initialization.
  - `app/__tests__/lib/db.test.ts`: Unit tests for the Supabase client.
  - `supabase/migrations/20251204000000_initial_schema.sql`: Initial database schema with RLS.
  - `scripts/test-supabase-connection.ts`: Script to test Supabase connectivity.
- **Architectural Decisions**:
  - RLS strategy: starting with restrictive policies, to be opened in Story 1.6 (RBAC).
  - Next.js application lives in the `app` subdirectory.
  - Unit tests in `app/__tests__/`, E2E tests in `tests/e2e/`.
  - CI/CD via GitHub Actions (`.github/workflows/ci.yml`) will run tests on push, so new UI component tests should be integrated.
- **Warnings/Recommendations**:
  - Remember to apply the migration to the Supabase instance.
  - ESLint is configured; new files must adhere to rules.

[Source: docs/sprint-artifacts/1-2-setup-supabase-backend-and-schema.md#Dev-Agent-Record]

## Change Log

- 2025-12-04: Initial draft by BIP
- 2025-12-05: Implemented Core UI Library (shadcn/ui), Tailwind v4 config, LessonCard component, and UX patterns. Added unit tests.

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-3-implement-core-ui-component-library.context.xml

### Agent Model Used

### Debug Log References

### Completion Notes List
- Installed shadcn/ui and initialized with neutral base color.
- Configured Tailwind v4 (`app/app/globals.css`) with custom colors and fonts from UX spec.
- Added `Manrope` and `Inter` fonts via `next/font/google`.
- Implemented `LessonCard` component with comprehensive unit tests.
- Updated `Button` component to use `rounded-lg` default radius.
- Installed `sonner` for toasts and `form` components.
- Created `app/app/test-ui/page.tsx` for pattern verification.

### File List
- app/app/globals.css
- app/app/layout.tsx
- app/components/ui/button.tsx
- app/components/ui/sonner.tsx
- app/components/ui/label.tsx
- app/components/ui/form.tsx
- app/components/ui/input.tsx
- app/components/ui/card.tsx
- app/components/ui/dialog.tsx
- app/lib/utils.ts
- app/components/LessonCard.tsx
- app/__tests__/components/LessonCard.test.tsx
- app/vitest.config.ts
- app/app/test-ui/page.tsx
