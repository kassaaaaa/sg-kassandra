---
epic: Epic 3 - Manager and Instructor Dashboards
story_id: 3-6
title: Manager School Settings Configuration
description: As a Manager, I want to configure school-wide settings, so I can customize the platform to our school's needs.
author: BIP
status: review
prerequisites:
  - story_1-6
functional_requirements:
  - FR022
  - FR031
  - FR035
---

### User Story

As a Manager, I want to configure school-wide settings, so I can customize the platform to our school's needs.

### Acceptance Criteria

1.  **Page Accessibility & Layout:**
    a. A dedicated "Settings" page is accessible to logged-in Managers via the main navigation.
    b. The layout and components of the settings page must be visually and functionally consistent with the "Settings" view in the wireframe. [Source: docs/wireframes/manager-dashboard.html]

2.  **Weather Parameter Configuration (FR022, FR031, FR035):**
    a. Managers can define and save scheduling weather rules, including minimum/maximum wind speed, preferred wind directions, and whether precipitation is allowed.
    b. The system provides clear validation warnings if a manager attempts to save illogical settings (e.g., minimum wind speed higher than maximum wind speed).
    c. The "Intelligent Scheduling Engine" correctly uses these configured parameters when making decisions.

3.  **Lesson Types Management (FR022):**
    a. Managers can add new lesson types, specifying their name, description, default duration, and price, using the "Add New Lesson Type" modal from the wireframe.
    b. Managers can edit existing lesson types using the "Edit Lesson Type" modal.
    c. Managers can activate or deactivate lesson types. Deactivated lesson types cannot be booked but are not removed from existing bookings.

4.  **Branding Configuration (FR022):**
    a. Managers can upload a school logo using the "Upload School Logo" modal.
    b. The uploaded logo is displayed in designated areas of the application, such as the dashboard header.

5.  **Data Persistence:**
    a. All configuration changes are persisted to the `school_settings` table in the Supabase database.
    b. Data is fetched and updated using the designated Edge Function APIs (`GET` and `PUT /edge/manager/settings`).

### Tasks/Subtasks
- [x] **Frontend (Next.js)** (AC: #1, #2, #3, #4)
    - [x] Create the settings page component at `app/(protected)/settings/page.tsx`.
    - [x] Build the UI using `shadcn/ui` components, strictly following the layout, styling, and interactions shown in `docs/wireframes/manager-dashboard.html`. This includes all modals for adding/editing lesson types and uploading the logo.
    - [x] Use `React Hook Form` with `Zod` for comprehensive validation of all form inputs on the page.
    - [x] Utilize `TanStack Query` to fetch the initial settings data from the `GET /edge/manager/settings` endpoint and to manage the mutation state when saving changes.
- [x] **Backend (Supabase)** (AC: #2, #3, #4, #5)
    - [x] **API Endpoints**
        - [x] Implement the `GET /edge/manager/settings` Supabase Edge Function to retrieve all data from the `school_settings` table for the logged-in manager's school.
        - [x] Implement the `PUT /edge/manager/settings` Supabase Edge Function to handle updates. This function must perform server-side validation of the incoming data (especially for weather parameters) before updating the `school_settings` table.
    - [x] **Database**
        - [x] Ensure the `school_settings` table schema in a new migration file matches the `tech-spec-epic-3.md` (including `weather_api_thresholds`, `lesson_types`, `school_logo_url`, etc.).
    - [x] **Storage**
        - [x] Use Supabase Storage for handling school logo uploads. The `PUT` Edge Function will receive the uploaded file URL and update the `school_logo_url` field in the `school_settings` table.
    - [x] **Security**
        - [x] Update Row Level Security (RLS) policies to ensure only users with the 'Manager' role can read from or write to the `school_settings` table and its corresponding API endpoints.
- [x] **Component Reusability** (AC: #3, #4)
    - [x] The various modals defined in the wireframe (e.g., `add-lesson-type-modal`, `upload-logo-modal`, `deactivate-lesson-type-modal`) should be created as reusable React components.
- [x] **Testing Strategy** (AC: #1, #2, #3, #4, #5)
    - [x] **Unit Tests:**
        - [x] Write unit tests for the `PUT /edge/manager/settings` Edge Function to verify its validation logic, especially for out-of-range weather parameters.
        - [x] Test individual form components and modals on the settings page to ensure they handle state, validation, and user input correctly in isolation.
    - [x] **Integration Tests:**
        - [x] Verify that the settings page (`app/(protected)/settings/page.tsx`) correctly fetches initial data from the `GET /edge/manager/settings` endpoint.
        - [x] Create a test to confirm that submitting the settings form successfully calls the `PUT /edge/manager/settings` endpoint and that the data is correctly persisted in the Supabase database.
        - [x] Write specific tests for the RLS policies on the `school_settings` table to ensure non-manager roles cannot access or modify the data.
    - [x] **End-to-End (E2E) Tests:**
        - [x] Create a Playwright test that simulates a full manager workflow: login, navigate to settings, change value, save, refresh and verify.
        - [x] Add an E2E test for the logo upload functionality.
        - [x] Add an E2E test for adding, editing, and deactivating a lesson type.

### Dev Notes

#### Architecture patterns and constraints
- All backend logic for settings management must be encapsulated within Supabase Edge Functions as defined in the tech spec.
- All date/time operations must be handled in the school's local time zone and stored in UTC, following the pattern in `architecture.md`.
- New UI components must follow the project's existing design system built with `shadcn/ui`.

#### Learnings from Previous Story
*Source: `docs/sprint-artifacts/3-5-manager-manual-booking-management.md`*
- **Patterns:** The `useSchoolData` hook was created and should be reused or extended for populating any necessary data (like existing lesson types). Continue using TanStack Query for server state management (`useQuery` for fetching, `useMutation` for updates).
- **Components:** The previous story implemented several modals (`AddBookingModal`, `EditBookingModal`, `CancelBookingModal`) and a shared `ManagerBookingForm`. Review these for patterns before creating the modals required for this story.
- **Unresolved Review Item:** The previous story's review identified a technical debt item. This may or may not be relevant to the current story, but the team needs to be aware of it:
  - `[ ] Note: Create a new technical debt story to implement true integration tests for the booking-service Edge Function, replacing the current mock-based unit tests.`
- **Files Modified in Previous Story:** The following files were recently created or heavily modified:
    - `supabase/migrations/20251211100000_manager_booking_ops.sql`
    - `supabase/functions/booking-service/index.ts`
    - `app/lib/booking-service.ts`
    - `app/lib/hooks/useBookingMutations.ts`
    - `app/lib/hooks/useSchoolData.ts`
    - `app/components/bookings/ManagerBookingForm.tsx`
    - `app/components/bookings/AddBookingModal.tsx`
    - `app/components/bookings/EditBookingModal.tsx`
    - `app/components/bookings/CancelBookingModal.tsx`
    - `app/components/calendar/ManagerCalendar.tsx`

#### Project Structure Notes
- **Components:** Create new components related to settings in `app/components/settings/`. Reusable modals should be placed here.
- **Page:** The main settings page should be located at `app/(protected)/settings/page.tsx`.
- **Hooks:** Any new hooks for settings data should be in `app/lib/hooks/`.
- **Services:** Client-side API wrappers should be in `app/lib/settings-service.ts`.

#### References
- **PRD:** [Source: docs/fase-2-plan/PRD.md]
- **Epics:** Story 3.6 [Source: docs/fase-3-solution/epics.md]
- **Tech Spec:** School Settings Configuration (FR022) [Source: docs/sprint-artifacts/tech-spec-epic-3.md]
- **Architecture:** General Guidance [Source: docs/fase-3-solution/architecture.md]
- **Wireframes:** `manager-dashboard.html` [Source: docs/wireframes/manager-dashboard.html]

### Technical Implementation Details

1.  **Frontend (Next.js): (AC: #1, #2, #3, #4)**
    *   Create the settings page component at `app/(protected)/settings/page.tsx`.
    *   Build the UI using `shadcn/ui` components, strictly following the layout, styling, and interactions shown in `docs/wireframes/manager-dashboard.html`. This includes all modals for adding/editing lesson types and uploading the logo.
    *   Use `React Hook Form` with `Zod` for comprehensive validation of all form inputs on the page.
    *   Utilize `TanStack Query` to fetch the initial settings data from the `GET /edge/manager/settings` endpoint and to manage the mutation state when saving changes.

2.  **Backend (Supabase): (AC: #2, #3, #4, #5)**
    *   **API Endpoints:**
        *   Implement the `GET /edge/manager/settings` Supabase Edge Function to retrieve all data from the `school_settings` table for the logged-in manager's school.
        *   Implement the `PUT /edge/manager/settings` Supabase Edge Function to handle updates. This function must perform server-side validation of the incoming data (especially for weather parameters) before updating the `school_settings` table.
    *   **Database:**
        *   Ensure the `school_settings` table schema in a new migration file matches the `tech-spec-epic-3.md` (including `weather_api_thresholds`, `lesson_types`, `school_logo_url`, etc.).
    *   **Storage:**
        *   Use Supabase Storage for handling school logo uploads. The `PUT` Edge Function will receive the uploaded file URL and update the `school_logo_url` field in the `school_settings` table.
    *   **Security:**
        *   Update Row Level Security (RLS) policies to ensure only users with the 'Manager' role can read from or write to the `school_settings` table and its corresponding API endpoints.

3.  **Component Reusability: (AC: #3, #4)**
    *   The various modals defined in the wireframe (e.g., `add-lesson-type-modal`, `upload-logo-modal`, `deactivate-lesson-type-modal`) should be created as reusable React components.

### Testing Strategy

1.  **Unit Tests:**
    *   Write unit tests for the `PUT /edge/manager/settings` Edge Function to verify its validation logic, especially for out-of-range weather parameters. (AC: #2)
    *   Test individual form components and modals on the settings page to ensure they handle state, validation, and user input correctly in isolation. (AC: #1, #3, #4)

2.  **Integration Tests:**
    *   Verify that the settings page (`app/(protected)/settings/page.tsx`) correctly fetches initial data from the `GET /edge/manager/settings` endpoint. (AC: #5)
    *   Create a test to confirm that submitting the settings form successfully calls the `PUT /edge/manager/settings` endpoint and that the data is correctly persisted in the Supabase database. (AC: #5)
    *   Write specific tests for the RLS policies on the `school_settings` table to ensure non-manager roles cannot access or modify the data. (AC: #5)

3.  **End-to-End (E2E) Tests:**
    *   Create a Playwright test that simulates a full manager workflow:
        1.  Logs in as a Manager.
        2.  Navigates to the "Settings" page.
        3.  Changes a value (e.g., minimum wind speed).
        4.  Saves the settings.
        5.  Refreshes the page and verifies the new value is present. (AC: #2)
    *   Add an E2E test for the logo upload functionality, verifying the image is uploaded and the URL is saved. (AC: #4)
    *   Add an E2E test for adding, editing, and deactivating a lesson type, ensuring the UI updates correctly. (AC: #3)

### Dev Agent Record

- **Context Reference:**
  - `docs/sprint-artifacts/3-6-manager-school-settings-configuration.context.xml`
- **Agent Model Used:**
- **Debug Log References:**
- **Completion Notes List:**
### File List
- app/app/(protected)/settings/page.tsx
- app/components/settings/SettingsView.tsx
- app/components/settings/WeatherParamsForm.tsx
- app/components/settings/LessonTypesList.tsx
- app/components/settings/AddLessonTypeModal.tsx
- app/components/settings/EditLessonTypeModal.tsx
- app/components/settings/BrandingForm.tsx
- app/lib/settings-service.ts
- app/lib/hooks/useSchoolSettings.ts
- supabase/migrations/20251212100000_update_school_settings.sql
- supabase/functions/manager-settings/index.ts
- app/__tests__/settings/WeatherParamsForm.test.tsx
- tests/e2e/manager-settings.spec.ts

### Change Log
- 2025-12-12: Initial draft generated.
- 2025-12-12: Auto-improved by Scrum Master Agent based on validation report. Addressed 3 critical, 6 major, and 2 minor issues.