# Epic Technical Specification: {{epic_title}}

Date: 2025-12-10
Author: BIP
Epic ID: 3
Status: Draft

---

## Overview

This Epic Technical Specification outlines the technical design for Epic 3: "Manager Oversight & Administration". This epic focuses on providing managers with the necessary tools to effectively oversee and manage all school operations within the KiteOps platform. It aims to streamline administrative tasks, enhance visibility into scheduling and resources, and facilitate efficient coordination among instructors and customers.

## Objectives and Scope

### Objectives
*   Provide managers with a comprehensive dashboard for operational oversight.
*   Enable managers to view and manage a master calendar of all lessons and instructor availability.
*   Allow managers to manually add, edit, or cancel any booking.
*   Facilitate efficient customer and instructor management.
*   Enable managers to configure school-wide settings.

### In Scope
*   Manager Dashboard (FR023)
*   Master Calendar View (FR024)
*   Manual Booking Management (FR025, FR026)
*   Customer and Instructor Management (FR028)
*   School Settings Configuration (FR022)
*   Manager Confirmation for Automated Rebooking (FR036)
*   Handling No-Show and Early Lesson Termination (FR037, FR038, FR039)

### Out of Scope
*   Advanced AI Manager's Co-Pilot
*   Fully Automated Rebooking (beyond manager-driven suggestions)
*   Financial dashboards
*   Extended manager roles (e.g., owner, receptionist)

## System Architecture Alignment

This epic aligns with the overall KiteOps architecture by leveraging Next.js for the frontend, Supabase for backend services (PostgreSQL, Edge Functions, Auth, Realtime, Storage), and Vercel for deployment. Manager-specific UI components will be built using Tailwind CSS and shadcn/ui. Backend logic for managing bookings and configurations will primarily reside in Supabase Edge Functions and PostgreSQL database functions, ensuring scalability and consistency with existing patterns. Row Level Security (RLS) will be critical for manager-specific data access.

## Detailed Design

## Detailed Design

### Services and Modules

| Service/Module        | Responsibilities                                                                                                 | Inputs/Outputs                                                                            | Owner       |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- | :---------- |
| ManagerDashboard (UI) | Display operational overview, instructor availability summary, rebooking alerts.                                   | `GET /api/manager/dashboard` (summary data)                                               | Frontend    |
| ManagerCalendar (UI)  | Interactive master calendar with filtering for instructors and lesson types; drag-and-drop reassignment.         | `GET /api/manager/calendar` (booking data), `PUT /api/manager/bookings/:id` (reassignment) | Frontend    |
| BookingManagement (UI)| List, add, edit, cancel bookings.                                                                                | `GET /api/manager/bookings`, `POST /api/manager/bookings`, `PUT /api/manager/bookings/:id` | Frontend    |
| UserManagement (UI)   | View, search, filter customer and instructor lists; manage profiles.                                             | `GET /api/manager/users`, `PUT /api/manager/users/:id`                                    | Frontend    |
| SchoolSettings (UI)   | Configure school-wide settings (weather params, lesson types, logo).                                             | `GET /api/manager/settings`, `PUT /api/manager/settings`                                  | Frontend    |
| BookingService (Edge) | Handles `create`, `update`, `cancel` of any booking. Includes override logic for manager assignments.            | Booking details (JSON), Instructor ID                                                     | Backend     |
| ProfileService (Edge) | Manages user profiles for customers and instructors (e.g., adding/editing skills, certifications).               | User profile data (JSON)                                                                  | Backend     |
| SchoolSettingsService (Edge)| Provides and updates school configuration parameters.                                                    | School settings (JSON)                                                                    | Backend     |
| NotificationService (Edge)| Triggers notifications for manager confirmations, no-shows, and early terminations.                      | Notification content, recipient list                                                      | Backend     |

### Data Models and Contracts

Building upon the core Supabase PostgreSQL schema, the following extensions/modifications are relevant for Epic 3:

*   **`profiles` table:** `role` column (Manager, Instructor, Customer, Guest). RLS policies will enforce manager access.
*   **`bookings` table:**
    *   `manager_notes`: TEXT (for manager internal notes)
    *   `manager_confirmed_rebooking`: BOOLEAN (FR036)
    *   `status_reason`: TEXT (expanded for 'Instructor No-Show', 'Customer No-Show', 'Early Termination Reason') (FR037, FR038, FR039)
*   **`school_settings` table:**
    *   `weather_api_thresholds`: JSONB (configurable by manager, FR022)
    *   `lesson_types`: JSONB (configurable list, FR022)
    *   `school_logo_url`: TEXT
    *   `rebooking_confirmation_required`: BOOLEAN (FR036)

### APIs and Interfaces

All manager-facing operations will be exposed via Supabase Edge Functions to ensure fine-grained control and business logic encapsulation.

*   `POST /edge/manager/bookings` - Create a new booking (manual by manager)
    *   Request: `{ customer_id, instructor_id, lesson_type, start_time, end_time, location, ... }`
    *   Response: `{ booking_id, status }`
*   `PUT /edge/manager/bookings/:id` - Update an existing booking (manual by manager, including reassignment)
    *   Request: `{ instructor_id?, start_time?, end_time?, status?, ... }`
    *   Response: `{ booking_id, status }`
*   `DELETE /edge/manager/bookings/:id` - Cancel a booking
    *   Response: `{ success: true }`
*   `GET /edge/manager/dashboard` - Retrieve dashboard summary data
    *   Response: `{ operational_overview, instructor_availability_summary, rebooking_alerts }`
*   `GET /edge/manager/calendar` - Retrieve master calendar data with filters
    *   Query Params: `instructor_id?, lesson_type?, start_date?, end_date?`
    *   Response: `[ { booking_id, instructor_name, customer_name, lesson_type, start_time, end_time, ... } ]`
*   `GET /edge/manager/users` - List all customers and instructors
    *   Query Params: `role? (customer|instructor), search?`
    *   Response: `[ { user_id, name, email, role, ... } ]`
*   `PUT /edge/manager/users/:id` - Update user profile (customer or instructor)
    *   Request: `{ name?, email?, ... }`
    *   Response: `{ user_id, name, email, ... }`
*   `GET /edge/manager/settings` - Retrieve school settings
    *   Response: `{ weather_api_thresholds, lesson_types, school_logo_url, ... }`
*   `PUT /edge/manager/settings` - Update school settings
    *   Request: `{ weather_api_thresholds?, lesson_types?, school_logo_url?, ... }`
    *   Response: `{ success: true }`

### Workflows and Sequencing

#### 1. Manager Manual Booking/Reassignment (FR025, FR026)

1.  Manager accesses the Master Calendar or Booking List.
2.  Manager initiates 'Add Booking' or 'Edit Booking' action.
3.  Manager provides/updates lesson details, including instructor assignment.
4.  Frontend invokes `PUT /edge/manager/bookings/:id` (for edit) or `POST /edge/manager/bookings` (for new).
5.  Edge Function updates `bookings` table. If reassignment, checks for conflicts and overrides scheduling engine suggestions as per FR026.
6.  If status changes (e.g., instructor reassigned), `NotificationService` triggered for relevant parties.
7.  Frontend displays confirmation to manager.

#### 2. School Settings Configuration (FR022)

1.  Manager navigates to 'School Settings' page.
2.  Manager modifies settings (e.g., weather API thresholds, lesson types).
3.  Frontend invokes `PUT /edge/manager/settings`.
4.  Edge Function validates input and updates `school_settings` table.
5.  Frontend displays success message.

#### 3. Handling No-Show and Early Termination (FR037, FR038, FR039)

1.  Instructor or Manager identifies a no-show or early termination.
2.  Instructor/Manager updates booking status (e.g., via UI action on calendar/dashboard).
3.  Frontend invokes `PUT /edge/manager/bookings/:id` (or similar instructor API).
4.  Edge Function updates `bookings` table, setting `status_reason` and logging actual duration for early termination.
5.  If 'Instructor No-Show', an emergency re-assignment or cancellation workflow is triggered (potentially manager-notified).
6.  Notifications sent to relevant parties (e.g., customer for 'Instructor No-Show', for logging/billing for 'Customer No-Show').

## Non-Functional Requirements

### Performance

*   **NFR01 (Performance):** All manager-facing dashboards and calendar views shall load in under 3 seconds. Critical manager actions, such as manual booking creation, updates, or reassignments, shall be confirmed to the user in under 2 seconds. These align with the general performance NFR in the PRD and are supported by the Vercel Edge Network and TanStack Query.

### Security

*   **NFR03 (Security):** All manager actions and data access will be subject to robust authentication and authorization via Supabase Auth and PostgreSQL Row Level Security (RLS) based on the manager role. This ensures that managers can only access and modify data relevant to their role and school. All sensitive data will be encrypted in transit and at rest.

### Reliability/Availability

*   **NFR05 (Reliability):** The core booking and management system for managers shall have an uptime of 99.9%. The system will be resilient to failures and gracefully handle issues during manual booking/reassignment, providing clear feedback to the manager. This aligns with the overall system reliability goals.

### Observability

*   All manager actions (e.g., manual booking changes, reassignments, school setting configurations) will be logged with sufficient detail for auditing and troubleshooting. This includes the manager's ID, action performed, and affected entities. Notification logging (FR032) is crucial for manager-triggered notifications (e.g., rebooking confirmations).
*   Key metrics for manager activity, such as the frequency of manual overrides or changes to school settings, will be collected to understand system usage and potential areas for improvement.

## Dependencies and Integrations

This epic relies on the established technology stack and integrates with existing services within the KiteOps architecture. Key dependencies and integration points are:

*   **Frontend:**
    *   **Next.js (v16.0.7):** Core web framework.
    *   **React (v19.2.0):** UI library.
    *   **Tailwind CSS (v4.x), shadcn/ui:** Styling and UI component library.
    *   **React Hook Form (v7.68.0), Zod (v4.1.13):** Form management and validation for manager input.
    *   **@tanstack/react-query (v5.90.12):** Server state management for efficient data fetching and caching on manager dashboards and calendar views.
    *   **date-fns (v4.1.0):** Date utility library for calendar and scheduling interactions.

*   **Backend (Supabase Ecosystem):**
    *   **@supabase/supabase-js (v2.86.0), @supabase/ssr (v0.8.0):** Client libraries for interacting with Supabase services (PostgreSQL, Auth, Edge Functions, Realtime, Storage).
    *   **PostgreSQL (v15.x):** Primary database for storing all application data, including bookings, profiles, and school settings.
    *   **Supabase Edge Functions:** Used for custom backend logic for manager actions (e.g., manual booking management, school settings configuration).
    *   **Supabase Realtime:** For live updates on manager dashboards and calendars (e.g., when a booking status changes).

*   **External Integrations (orchestrated via Supabase Edge/DB Functions):
    *   **OpenWeatherMap API (v3.0):** Provides weather data for the intelligent scheduling engine, which managers interact with during rebooking proposals.
    *   **Resend (v6.5.2):** Email service for sending notifications related to manager-initiated actions (e.g., booking confirmations, cancellations).
    *   **Twilio (v5.10.6):** SMS service for critical alerts and notifications.

*   **Deployment:**
    *   **Vercel:** Platform for deploying the Next.js frontend and Supabase Edge Functions.

## Acceptance Criteria (Authoritative)

1.  **FR022 - School Settings Configuration:** Managers can configure school-wide settings, including weather parameters, lesson types, and the school logo.
    a.  Verify that changes to weather parameters are saved and applied to the scheduling engine.
    b.  Verify that new lesson types can be added and existing ones modified.
    c.  Verify that the school logo can be uploaded and displayed.
    d.  Verify that clear validation and warnings are provided for out-of-normal parameter configurations (FR035).
2.  **FR023 - Manager Dashboard:** Managers have a dashboard displaying an operational overview, instructor availability summary, and rebooking alerts.
    a.  Verify that the dashboard accurately reflects current operational status.
    b.  Verify that the instructor availability summary is correct and up-to-date.
    c.  Verify that rebooking alerts are prominently displayed for lessons impacted by bad weather (FR027).
3.  **FR024 - Master Calendar View:** Managers can view a master calendar with filtering options for instructors and lesson types.
    a.  Verify that the master calendar displays all lessons and instructor availability.
    b.  Verify that lessons can be filtered by instructor.
    c.  Verify that lessons can be filtered by lesson type.
4.  **FR025 & FR026 - Manual Booking Management:** Managers can manually add, edit, cancel any booking, and assign/reassign instructors, overriding the scheduling engine.
    a.  Verify that managers can create new bookings with specified instructors, dates, and times.
    b.  Verify that managers can modify existing booking details (e.g., time, location).
    c.  Verify that managers can cancel any booking.
    d.  Verify that managers can reassign an instructor to an existing lesson, overriding the scheduling engine.
    e.  Verify that notifications are sent to affected parties upon manual changes.
5.  **FR028 - Customer and Instructor Management:** Managers can view, search, and filter a list of all customers and instructors, and manage their profiles.
    a.  Verify that managers can view a comprehensive list of all customers.
    b.  Verify that managers can search and filter the customer list.
    c.  Verify that managers can edit customer profiles.
    d.  Verify that managers can view a comprehensive list of all instructors.
    e.  Verify that managers can search and filter the instructor list.
    f.  Verify that managers can edit instructor profiles.
6.  **FR036 - Automated Rebooking Confirmation:** All automated rebookings require a final confirmation from a Manager before notifications are sent.
    a.  Verify that automated rebooking proposals are presented to the manager for confirmation.
    b.  Verify that notifications for rebookings are only sent after manager confirmation.
7.  **FR037, FR038, FR039 - No-Show and Early Termination:** The system allows managers (and instructors for some cases) to mark lessons as 'Instructor No-Show', 'Customer No-Show', or 'Early Lesson Termination'.
    a.  Verify that a manager can mark a lesson as 'Instructor No-Show' and trigger an emergency workflow.
    b.  Verify that a manager can mark a lesson as 'Customer No-Show' and that the status is logged.
    c.  Verify that an instructor (and thus a manager viewing the booking) can mark a lesson as 'Early Lesson Termination' with a reason and logged duration.
    
## Traceability Mapping

| Acceptance Criteria (AC) | Spec Section(s)          | Component(s)/API(s)                  | Test Idea                                                    |
| :----------------------- | :----------------------- | :----------------------------------- | :----------------------------------------------------------- |
| 1.a-d (FR022, FR035)     | School Settings          | SchoolSettings (UI), SchoolSettingsService (Edge) | UI integration tests, Edge Function unit tests for validation |
| 2.a-c (FR023, FR027)     | Manager Dashboard        | ManagerDashboard (UI), BookingService (Edge)      | UI integration tests, data aggregation tests                   |
| 3.a-c (FR024)            | Master Calendar          | ManagerCalendar (UI), BookingService (Edge)      | UI integration tests for filtering and display              |
| 4.a-e (FR025, FR026)     | Manual Booking Management| BookingManagement (UI), BookingService (Edge)      | End-to-end tests for booking CRUD, Edge Function unit tests   |
| 5.a-f (FR028)            | User Management          | UserManagement (UI), ProfileService (Edge)       | UI integration tests for user listing and profile updates     |
| 6.a-b (FR036)            | Rebooking Confirmation   | BookingService (Edge), NotificationService (Edge) | End-to-end tests for rebooking workflow, notification tests   |
| 7.a-c (FR037, FR038, FR039)| No-Show/Early Term.     | BookingService (Edge), NotificationService (Edge) | End-to-end tests for status updates, logging verification     |

## Risks, Assumptions, Open Questions

*   **Risk: Manager Override Conflicts:** Manual overrides by managers (FR026) could inadvertently introduce scheduling conflicts or inconsistencies if the underlying logic for conflict detection is not robust. *Mitigation:* Comprehensive validation within the BookingService Edge Function and clear UI feedback on potential conflicts.
*   **Risk: Performance of Manager Dashboards/Calendars:** Large datasets for bookings, instructors, and customers could impact the load times and responsiveness of manager-facing UI. *Mitigation:* Efficient API design, database indexing, and client-side caching with TanStack Query.
*   **Assumption: Clear User Roles and Permissions:** It is assumed that the role-based access control (FR001) is robustly implemented, ensuring only authorized managers can perform administrative actions.
*   **Open Question: Audit Trail for Manager Actions:** While logging is required (NFR Observability), the specific details and retention policy for audit trails of manager overrides and sensitive configurations need to be finalized.

## Test Strategy Summary

The testing strategy for Epic 3 will adhere to the layered approach (Unit, Integration, End-to-End) outlined in the Architecture Document, with a specific focus on manager-centric functionalities.

*   **Unit Tests:**
    *   **Edge Functions:** Thorough unit testing of all Supabase Edge Functions handling manager logic (e.g., BookingService, SchoolSettingsService, ProfileService) to ensure business rules, validation, and RLS are correctly applied.
    *   **UI Components:** Unit tests for React components (e.g., ManagerDashboard, ManagerCalendar, UserManagement) to verify correct rendering and isolated behavior.

*   **Integration Tests:**
    *   **Frontend-Backend Integration:** Verify that manager UI components correctly interact with Supabase Edge Functions and the PostgreSQL database.
    *   **RLS Policies:** Explicit integration tests to confirm that Row Level Security policies effectively restrict/permit manager access based on their role.
    *   **Scheduling Engine Overrides:** Test manager override capabilities for the scheduling engine (FR026) to ensure manual assignments work as expected without introducing conflicts.

*   **End-to-End (E2E) Tests:**
    *   **Manager User Journeys:** Full E2E tests simulating manager workflows (e.g., logging in, configuring settings, manually creating a booking, reassigning an instructor, confirming a rebooking proposal, marking no-shows).
    *   **Notification Flows:** E2E tests to verify that correct notifications are triggered and sent for manager-initiated actions and confirmations (FR036).

*   **Key Coverage Areas:**
    *   Validation of manager inputs for school settings and booking modifications (FR035).
    *   Accurate display of data on manager dashboards and calendars (FR023, FR024).
    *   Correct application of manager overrides to the scheduling engine (FR026).
    *   Secure access control for all manager functionalities.
    *   Proper logging of manager actions and status updates (FR037, FR038, FR039).

### Post-Review Follow-ups

- [ ] [Low] Consider moving lesson type filtering to backend for performance (AC #3) [Ref: Story 3.4]
- [ ] [Low] Make calendar start/end hours configurable in school_settings (AC #1) [Ref: Story 3.4]
