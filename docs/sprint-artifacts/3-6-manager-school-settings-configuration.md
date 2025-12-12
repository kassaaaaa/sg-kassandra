---
epic: Epic 3 - Manager and Instructor Dashboards
story_id: 3-6
title: Manager School Settings Configuration
description: As a Manager, I want to configure school-wide settings, so I can customize the platform to our school's needs.
author: BIP
status: pending
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
    b. The layout and components of the settings page must be visually and functionally consistent with the "Settings" view in the `docs/wireframes/manager-dashboard.html` wireframe.

2.  **Organization Details Configuration:**
    a. Managers can update the school's name, contact email, phone number, and primary location (latitude/longitude).
    b. These changes are saved and reflected across the application where this information is used.

3.  **Weather Parameter Configuration (FR022, FR031, FR035):**
    a. Managers can define and save scheduling weather rules, including minimum/maximum wind speed, preferred wind directions, and whether precipitation is allowed.
    b. The system provides clear validation warnings if a manager attempts to save illogical settings (e.g., minimum wind speed higher than maximum wind speed).
    c. The "Intelligent Scheduling Engine" correctly uses these configured parameters when making decisions.

4.  **Lesson Types Management (FR022):**
    a. Managers can add new lesson types, specifying their name, description, default duration, and price, using the "Add New Lesson Type" modal from the wireframe.
    b. Managers can edit existing lesson types using the "Edit Lesson Type" modal.
    c. Managers can activate or deactivate lesson types. Deactivated lesson types cannot be booked but are not removed from existing bookings.

5.  **Branding Configuration (FR022):**
    a. Managers can upload a school logo using the "Upload School Logo" modal.
    b. The uploaded logo is displayed in designated areas of the application, such as the dashboard header.

6.  **Data Persistence:**
    a. All configuration changes are persisted to the `school_settings` table in the Supabase database.
    b. Data is fetched and updated using the designated Edge Function APIs (`GET` and `PUT /edge/manager/settings`).

### Technical Implementation Details

1.  **Frontend (Next.js):**
    *   Create the settings page component at `app/(protected)/settings/page.tsx`.
    *   Build the UI using `shadcn/ui` components, strictly following the layout, styling, and interactions shown in `docs/wireframes/manager-dashboard.html`. This includes all modals for adding/editing lesson types and uploading the logo.
    *   Use `React Hook Form` with `Zod` for comprehensive validation of all form inputs on the page.
    *   Utilize `TanStack Query` to fetch the initial settings data from the `GET /edge/manager/settings` endpoint and to manage the mutation state when saving changes.

2.  **Backend (Supabase):**
    *   **API Endpoints:**
        *   Implement the `GET /edge/manager/settings` Supabase Edge Function to retrieve all data from the `school_settings` table for the logged-in manager's school.
        *   Implement the `PUT /edge/manager/settings` Supabase Edge Function to handle updates. This function must perform server-side validation of the incoming data (especially for weather parameters) before updating the `school_settings` table.
    *   **Database:**
        *   Ensure the `school_settings` table schema in a new migration file matches the `tech-spec-epic-3.md` (including `weather_api_thresholds`, `lesson_types`, `school_logo_url`, etc.).
    *   **Storage:**
        *   Use Supabase Storage for handling school logo uploads. The `PUT` Edge Function will receive the uploaded file URL and update the `school_logo_url` field in the `school_settings` table.
    *   **Security:**
        *   Update Row Level Security (RLS) policies to ensure only users with the 'Manager' role can read from or write to the `school_settings` table and its corresponding API endpoints.

3.  **Component Reusability:**
    *   The various modals defined in the wireframe (e.g., `add-lesson-type-modal`, `upload-logo-modal`, `deactivate-lesson-type-modal`) should be created as reusable React components.

### Testing Strategy

1.  **Unit Tests:**
    *   Write unit tests for the `PUT /edge/manager/settings` Edge Function to verify its validation logic, especially for out-of-range weather parameters.
    *   Test individual form components and modals on the settings page to ensure they handle state, validation, and user input correctly in isolation.

2.  **Integration Tests:**
    *   Verify that the settings page (`app/(protected)/settings/page.tsx`) correctly fetches initial data from the `GET /edge/manager/settings` endpoint.
    *   Create a test to confirm that submitting the settings form successfully calls the `PUT /edge/manager/settings` endpoint and that the data is correctly persisted in the Supabase database.
    *   Write specific tests for the RLS policies on the `school_settings` table to ensure non-manager roles cannot access or modify the data.

3.  **End-to-End (E2E) Tests:**
    *   Create a Playwright test that simulates a full manager workflow:
        1.  Logs in as a Manager.
        2.  Navigates to the "Settings" page.
        3.  Changes a value (e.g., minimum wind speed).
        4.  Saves the settings.
        5.  Refreshes the page and verifies the new value is present.
    *   Add an E2E test for the logo upload functionality, verifying the image is uploaded and the URL is saved.
    *   Add an E2E test for adding, editing, and deactivating a lesson type, ensuring the UI updates correctly.
