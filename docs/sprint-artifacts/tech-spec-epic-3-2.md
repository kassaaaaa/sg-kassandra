**Epic 3: Manager and Instructor Dashboards**

**1. Overview**

This technical specification outlines the implementation details for Epic 3: Manager and Instructor Dashboards. The primary goal of this epic is to provide managers and instructors with the necessary tools and interfaces to manage daily operations, view schedules, and administer school settings. This epic is critical for the operational efficiency of the kite school, directly supporting the roles defined in the PRD.

The instructor-facing features focus on providing a clear view of their daily schedule and weather conditions via a dedicated dashboard and an interactive calendar. The manager-facing features provide a high-level operational overview, including a master calendar, tools for manual booking management, user management (customers and instructors), and configuration of school-wide settings.

**2. Objectives & Scope**

**In Scope:**

*   **Instructor Dashboard:** A dashboard for instructors to view their daily and upcoming lessons and current weather conditions.
*   **Instructor Calendar View:** A full calendar view for instructors to see their scheduled lessons and availability.
*   **Manager Dashboard:** A dashboard for managers showing an operational overview, including daily bookings, instructor availability, and alerts for weather-conflicted lessons.
*   **Manager Resolution Center UI:** A user interface for managers to handle lessons impacted by weather.
*   **Manager Master Calendar:** A master calendar view of all school activities with filtering capabilities.
*   **Manual Booking Management:** Functionality for managers to manually add, edit, or cancel any booking.
*   **User Management:** Views for managers to list, view, and manage customer and instructor profiles.
*   **School Settings:** A page for managers to configure school-wide settings, such as lesson types and weather parameters.

**Out of Scope:**

*   **Real-time Notifications:** All real-time push or SMS notifications are out of scope for this epic (deferred to post-MVP).
*   **Automated Rebooking Logic:** While the UI for the Resolution Center is in scope, the backend logic to perform automated rebooking is not.
*   **Handling No-Shows/Early Termination:** The functionality for marking no-shows or ending lessons early is deferred.
*   **Direct Messaging:** Any direct or broadcast messaging features are out of scope.

**3. System Architecture Alignment**

The implementation of this epic will align with the established technical architecture. Specifically, it will leverage:

*   **Next.js with React:** All frontend components for the dashboards, calendars, and management pages will be built as React components within the Next.js framework.
*   **Supabase:** The Supabase backend will be the source of truth for all data, including bookings, user profiles, availability, and school settings. Row Level Security (RLS) policies will be strictly enforced to ensure data is accessed only by authorized roles (instructors, managers).
*   **shadcn/ui Component Library:** The UI will be constructed using the pre-configured `shadcn/ui` components to ensure consistency with the established design system.
*   **TanStack Query:** Data fetching for the dashboards and calendars will be handled by TanStack Query to manage server state, caching, and background refetching efficiently.
*   **Custom Calendar Component:** The calendar views will be based on the custom `Availability Calendar` component defined in the UX specification, adapted for the specific needs of the instructor and manager views.

The new pages and components will be integrated into the existing `(protected)` route group, ensuring that only authenticated users with the appropriate roles can access them, as enforced by the Next.js middleware.

**4. Detailed Design**

This section provides a detailed breakdown of the components, services, data models, and workflows required to implement Epic 3.

**4.1. Services & Modules (Frontend)**

| Service / Module | Responsibilities | Inputs / Outputs |
| :--- | :--- | :--- |
| **Instructor Dashboard** | - Display instructor's lessons for today/tomorrow.<br>- Display current weather widget.<br>- Provide navigation to the full calendar. | **In:** Instructor's user ID.<br>**Out:** Renders the instructor dashboard UI. |
| **Manager Dashboard** | - Display operational overview (total bookings, instructor availability).<br>- Display weather conflict alerts.<br>- Provide navigation to Resolution Center and Master Calendar. | **In:** Manager's user ID.<br>**Out:** Renders the manager dashboard UI. |
| **Resolution Center UI** | - List all lessons flagged with weather conflicts.<br>- Provide UI actions (Manual Rebook, Cancel) for each conflict. | **In:** List of conflicted booking IDs.<br>**Out:** Renders the resolution management UI. |
| **Master Calendar** | - Display all school bookings in a calendar view.<br>- Allow filtering by instructor and lesson type. | **In:** Date range, optional filters.<br>**Out:** Renders the master calendar view. |
| **Instructor Calendar** | - Display the logged-in instructor's schedule (lessons and availability).<br>- Provide multiple views (month, week, day, agenda). | **In:** Instructor's user ID, date range.<br>**Out:** Renders the personal instructor calendar. |
| **Booking Management** | - Modals and forms for managers to create, edit, and cancel bookings. | **In:** Booking data, customer data.<br>**Out:** Performs CRUD operations on bookings. |
| **User Management** | - UI for listing, searching, and viewing customer and instructor profiles. | **In:** Search/filter criteria.<br>**Out:** Renders user list and profile views. |
| **Settings Management** | - Form for managers to edit school-wide settings. | **In:** Current school settings.<br>**Out:** Updates school settings. |

**4.2. Data Models (Supabase)**

The implementation will rely on the existing Supabase schema. The primary tables involved are:

*   **`profiles`**: To identify user roles (manager, instructor) and link to user-specific data.
*   **`bookings`**: The core table for all lesson data. The dashboards and calendars will heavily query this table, joining with `profiles` (for instructor/customer names) and `lessons`.
*   **`availability`**: Used by the instructor's calendar to display their available slots alongside scheduled lessons.
*   **`SchoolSettings`**: A key-value or single-row table to store manager-configurable settings like weather parameters and lesson types.
*   **`customer_details` / `instructor_details`**: Queried for user management views.

**RLS policies are critical:**
*   Instructors can only read their own `bookings` and `availability`.
*   Managers can read all `bookings`, `availability`, `profiles`, and `SchoolSettings` within their school (assuming a multi-tenancy model in the future, for now it's global).

**4.3. APIs & Interfaces (Frontend Services)**

The Next.js application will use a service layer in the `lib/` directory to interact with Supabase. These functions will be called from React components, often via TanStack Query.

*   `getUserDashboardData(userId, role)`: Fetches data for either the instructor or manager dashboard based on the role.
*   `getCalendarData(userId, role, startDate, endDate, filters)`: Fetches bookings and/or availability for the calendar views.
*   `getWeatherConflicts()`: Fetches all bookings flagged for weather issues for the Resolution Center.
*   `updateBooking(bookingId, data)`: For managers to manually edit a booking.
*   `createBooking(data)`: For managers to create a new booking.
*   `cancelBooking(bookingId)`: For managers to cancel a booking.
*   `getUsers(role, filters)`: Fetches a list of customers or instructors for the user management page.
*   `getSchoolSettings()`: Retrieves the school's settings.
*   `updateSchoolSettings(data)`: Updates the school's settings.

**4.4. Workflows & Sequencing**

1.  **Instructor Login Flow:**
    *   User logs in, middleware verifies the 'instructor' role.
    *   User is redirected to `(protected)/dashboard`.
    *   The dashboard component calls `useQuery` which invokes `getUserDashboardData`.
    *   The UI displays a loading state, then populates with lesson and weather data.
    *   Instructor clicks "View Calendar" and navigates to the calendar page, which follows a similar data-fetching pattern.

2.  **Manager Weather Resolution Flow:**
    *   Manager logs in, is redirected to their dashboard.
    *   The `Weather Conflict Card` component fetches data. If conflicts exist, the card is displayed.
    *   Manager clicks "Review Lessons", navigating to the `(protected)/resolution-center`.
    *   The page fetches and lists all conflicted bookings.
    *   Manager clicks "Manual Rebook" on a lesson, which opens a modal pre-filled with the booking's data, allowing the manager to change the date/time or instructor.

**5. Non-Functional Requirements**

*   **Performance:**
    *   Dashboard and Calendar initial data load must complete within 2 seconds on a standard internet connection.
    *   Calendar interactions (e.g., changing months, applying filters) must update the UI in under 300ms.
    *   Database queries for calendars must be optimized with appropriate indexes on date ranges and user IDs.
*   **Security:**
    *   All data-fetching and mutation operations must be subject to strict Supabase RLS policies. No user should be able to see or modify data outside their authorized scope.
    *   Frontend routes (`(protected)/*`) must be protected by the authentication middleware.
*   **Reliability:**
    *   UI components must handle API errors gracefully, displaying an error message and a retry option instead of crashing.
    *   Data mutations (e.g., updating a booking) should provide clear feedback on success or failure.
*   **Observability:**
    *   All server-side errors within Supabase Edge Functions or data-fetching services should be logged.
    *   Frontend navigation and key user actions (e.g., booking cancelled, settings updated) should be tracked for product analytics.

**6. Dependencies and Integrations**

*   **`@supabase/supabase-js`**: For all communication with the Supabase backend.
*   **`@tanstack/react-query`**: For managing server state, caching, and data fetching.
*   **`shadcn/ui`**: For core UI components (Button, Card, Modal, etc.).
*   **`react-hook-form` / `zod`**: For managing forms and validation in the settings and booking management modals.
*   **`date-fns`**: For all date and time manipulations to ensure consistency.
*   **`@fullcalendar/react` (or similar):** A robust calendar library will be used as the foundation for the custom `Availability Calendar` component to handle rendering, events, and user interactions, as building a calendar from scratch is a significant risk.

**7. Acceptance Criteria and Traceability**

| Acceptance Criteria (AC) | Spec Section(s) | Component(s) / API(s) | Test Idea |
| :--- | :--- | :--- | :--- |
| **3.1:** Instructor sees a summary of their lessons for today and tomorrow. | 4.1, 4.3 | `InstructorDashboard`, `getUserDashboardData` | Log in as an instructor, verify the dashboard displays the correct lessons. |
| **3.2:** Manager sees an overview of daily bookings and a weather conflict card. | 4.1, 4.3 | `ManagerDashboard`, `getUserDashboardData` | Log in as a manager, verify the dashboard summary and that the conflict card appears when there are weather issues. |
| **3.3:** Manager can navigate to a Resolution Center listing all weather conflicts. | 4.1, 4.4 | `ResolutionCenter`, `getWeatherConflicts` | Click the "Review Lessons" button and verify the new page lists the correct bookings. |
| **3.4:** Manager can view a master calendar with all bookings and filter it. | 4.1, 4.3 | `MasterCalendar`, `getCalendarData` | Navigate to the calendar, verify all bookings are shown, and test the instructor/lesson type filters. |
| **3.5:** Manager can manually edit or cancel a booking from the master calendar. | 4.1, 4.3 | `BookingManagement`, `updateBooking`, `cancelBooking` | Click a booking on the calendar, edit its time in the modal, and verify the change is persisted. |
| **3.6:** Manager can update school-wide settings. | 4.1, 4.3 | `SettingsManagement`, `updateSchoolSettings` | Change a setting on the settings page, save, and verify the change is persisted on reload. |
| **3.7:** Manager can view a list of all customers and instructors. | 4.1, 4.3 | `UserManagement`, `getUsers` | Navigate to the "People" pages and verify that lists of users are displayed correctly. |
| **3.8:** Instructor can view their personal schedule on an interactive calendar. | 4.1, 4.3 | `InstructorCalendar`, `getCalendarData` | Log in as an instructor, navigate to the calendar, and verify their lessons and availability are shown. |

**8. Risks, Assumptions, and Test Strategy**

**Risks, Assumptions, Questions:**

*   **Risk:** The master calendar for managers could have performance issues if the number of bookings is very large.
    *   **Mitigation:** Implement server-side pagination for calendar events and aggressive indexing on the `bookings` table.
*   **Assumption:** The chosen calendar library (`@fullcalendar/react`) will be flexible enough to meet the custom design requirements from the UX specification.
    *   **Mitigation:** Conduct a brief proof-of-concept to validate the library's capabilities before full implementation.
*   **Question:** What are the specific fields that managers can configure in the "School Settings"?
    *   **Next Step:** Clarify with the product owner/stakeholder before building the settings UI.

**Test Strategy:**

*   **Unit Tests (Vitest):**
    *   Test individual data-fetching functions in `lib/*-service.ts` with mocked Supabase responses.
    *   Test the logic of UI components in isolation (e.g., does the `Weather Conflict Card` render correctly when given conflict data?).
*   **Integration Tests (React Testing Library + Vitest):**
    *   Test components that rely on Supabase data by connecting to a test Supabase instance to ensure RLS policies are working as expected.
*   **End-to-End Tests (Playwright):**
    *   Create test scripts that simulate complete user flows for both manager and instructor roles (e.g., login, view dashboard, manage booking, change settings).
    *   Verify that role-based access control correctly prevents instructors from accessing manager pages.
