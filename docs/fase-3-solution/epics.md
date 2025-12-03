# ibe160 - Epic Breakdown

**Author:** BIP
**Date:** Tuesday, December 2, 2025
**Project Level:** 3
**Target Scale:** Complex system with multiple user roles and automated scheduling

---

## Overview

This document provides the complete epic and story breakdown for {{project_name}}, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

**Living Document Notice:** This is the initial version. It will be updated after UX Design and Architecture workflows add interaction and technical details to stories.

🆕 **INITIAL CREATION MODE**

No existing epics found - I'll create the initial epic breakdown.

**Available Context:**
- ✅ PRD (required)
- ✅ UX Design (will incorporate interaction patterns)
- ✅ Architecture (will incorporate technical decisions)

---

## Functional Requirements Inventory

*   **FR001:** The system shall provide role-based access control for Guest, Customer, Instructor, and Manager roles.
*   **FR002:** The system shall allow users to register for Instructor or Manager accounts with email verification.
*   **FR003:** The system shall allow registered users to log in.
*   **FR004:** The system shall integrate with a weather API to fetch real-time weather data for scheduling.
*   **FR005:** The system's intelligent scheduling engine shall consider student skill level, weather suitability, and instructor load balancing when assigning instructors.
*   **FR006:** The system shall automatically send email and SMS notifications to all relevant parties (customer, instructor, manager) for booking confirmations, changes, and cancellations.
*   **FR007:** The system shall send automatic lesson reminders to customers and instructors (e.g., 24 hours prior).
*   **FR008:** The system shall perform an overlap check to prevent an individual instructor from creating conflicting entries on their own calendar.
*   **FR009:** Unregistered guests shall be able to start the booking process by providing contact information at the final confirmation step.
*   **FR010:** Customers shall be able to filter available lessons by skill level, lesson type, and date.
*   **FR011:** Customers shall be shown a booking summary with assigned instructor, date, time, location, and weather summary before confirming.
*   **FR012:** Customers must accept cancellation, rebooking, and refund/credit policies before confirming a booking. These policies must be clearly displayed.
*   **FR013:** Customers shall receive a confirmation screen with a booking reference number after a successful booking.
*   **FR014:** Customers shall be able to manage system-initiated rebooking proposals (e.g., due to weather) via a dedicated link sent by email.
*   **FR015:** Guests who have booked lessons shall be able to view their upcoming and past lessons via a secure link or booking reference.
*   **FR016:** Instructors shall be able to create and manage a professional profile including certifications, lesson types they can teach, and availability preferences.
*   **FR017:** Instructors shall have a dashboard displaying a summary of today's and upcoming lessons, and current weather.
*   **FR018:** Instructors shall be able to view and manage their schedule on an interactive calendar with month, week, day, and agenda views.
*   **FR019:** Instructors shall be able to add, modify, or remove their availability and block off personal time and recurrence (e.g., every Monday, weekly, bi-weekly).
*   **FR020:** Instructors shall be able to create new lessons for new or existing students.
*   **FR021:** Instructors shall be able to rebook or cancel lessons from their calendar.
*   **FR022:** Managers shall be able to configure school-wide settings, including weather parameters, lesson types, and the school logo.
*   **FR023:** Managers shall have a dashboard with an operational overview, instructor availability summary, and rebooking alerts.
*   **FR024:** Managers shall be able to view a master calendar with filtering options for instructors and lesson types.
*   **FR025:** Managers shall be able to manually add, edit, or cancel any booking in the system.
*   **FR026:** Managers shall be able to manually assign or reassign instructors to lessons, overriding any suggestions from the intelligent scheduling engine.
*   **FR027:** The system shall alert managers to lessons impacted by bad weather and propose rebooking solutions.
*   **FR028:** Managers shall be able to view, search, and filter a list of all customers and manage their profiles.
*   **FR029:** Managers shall be able to send broadcast or direct messages to customers and instructors.
*   **FR030:** The system must have a fallback mechanism in case the primary weather API is unavailable, such as using a secondary API or cached data.
*   **FR031:** The scheduling engine's logic must be transparent and configurable by the Manager, with an option for manual override.
*   **FR032:** The system must log all outgoing notifications and provide a way to monitor their delivery status.
*   **FR033:** The system should implement rate limiting or a CAPTCHA on the guest booking form to prevent abuse.
*   **FR034:** Rebooking links sent to users must be single-use and expire after a configurable amount of time to ensure security.
*   **FR035:** The system shall provide clear validation and warnings when a Manager configures settings outside of normal parameters.
*   **FR036:** All automated rebookings must require a final confirmation from a Manager before notifications are sent to customers.
*   **FR037:** The system shall allow a Manager to mark a lesson as 'Instructor No-Show' and trigger an emergency re-assignment or cancellation workflow.
*   **FR038:** The system shall allow an Instructor or Manager to mark a booking as 'Customer No-Show', and this status should be logged for reporting and potential billing.
*   **FR039:** The system shall allow an Instructor to end a lesson prematurely and log the actual duration, with a note explaining the reason (e.g., "Ended after 45 mins due to high wind").
*   **FR040:** The system shall support the creation of multi-session bookings (e.g., a 3-day clinic) for a single student or group.

---

## FR Coverage Map

This map outlines which Functional Requirements (FRs) are addressed by each epic, ensuring complete coverage of the project's scope.

### Epic 1: Foundation, Authentication, and Instructor Profiles
*   **Goal:** Establish the project's technical foundation, implement a robust user authentication system, and allow instructors to manage their professional profiles and availability.
*   **Covered FRs:** FR001, FR002, FR003, FR016, FR018, FR019, FR020, FR021.

### Epic 2: Customer Booking and Core Scheduling
*   **Goal:** Implement the end-to-end customer booking flow, from searching for lessons to confirmation, including the initial version of the intelligent scheduling engine.
*   **Covered FRs:** FR004, FR005, FR009, FR010, FR011, FR012, FR013, FR014, FR015, FR033, FR040.

### Epic 3: Manager and Instructor Dashboards
*   **Goal:** Provide managers and instructors with the tools they need to manage daily operations, including dashboards, master calendars, and the ability to manage bookings and users.
*   **Covered FRs:** FR017, FR022, FR023, FR024, FR025, FR026, FR027, FR028, FR029, FR031, FR035, FR036, FR037, FR038, FR039.

### Epic 4: Notifications, System Resilience, and Edge Cases
*   **Goal:** Implement the system-wide notification framework, enhance system robustness with fallbacks and logging, and handle critical operational edge cases.
*   **Covered FRs:** FR006, FR007, FR008, FR030, FR032, FR034.

## Epic 1: Foundation, Authentication, and Instructor Profiles

**Goal:** Establish the project's technical foundation, implement a robust user authentication system, and allow instructors to manage their professional profiles and availability.

### Story 1.1: Initialize Next.js Project and Setup CI/CD
As a Developer, I want to initialize the Next.js application and configure the basic CI/CD pipeline, so that we have a consistent and automated foundation for development and deployment.

**Acceptance Criteria:**
**Given** no project exists
**When** I run the initialization command
**Then** the project is initialized as a Next.js application in the root directory with TypeScript, Tailwind CSS, and ESLint configured.
**And** the project is connected to a Vercel account for automated deployments.
**And** a basic CI pipeline is configured to run linting and tests on every push to the main branch.

**Prerequisites:** None
**Technical Notes:** First, create a new subdirectory named `app`. Then, initialize the Next.js project inside the `app` subdirectory using the command `npx create-next-app@latest . --typescript --tailwind --eslint` as specified in `architecture.md`. Set up the Vercel project and connect the Git repository.

### Story 1.2: Setup Supabase Backend and Schema
As a Developer, I want to initialize the Supabase project and apply the initial database schema, so that the backend infrastructure is ready for development.

**Acceptance Criteria:**
**Given** a new Supabase project
**When** the initial migration script is run
**Then** the `profiles`, `lessons`, `bookings`, `availability`, `instructor_details`, and `customer_details` tables are created as per the data model in `architecture.md`.
**And** Row Level Security (RLS) is enabled on all tables with default-deny policies.
**And** the Supabase client is configured in the Next.js application in `lib/db.ts`.

**Prerequisites:** Story 1.1
**Technical Notes:** Create the initial schema migration in the `supabase/migrations/` directory. Use the Supabase JS Client for connecting from the Next.js app.

### Story 1.3: Implement Core UI Component Library
As a Developer, I want to set up and configure the `shadcn/ui` design system, so that all subsequent UI development is consistent and efficient.

**Acceptance Criteria:**
**Given** the Next.js project
**When** the `shadcn/ui` CLI is used
**Then** the core components (Button, Input, Card, Modal) are configured.
**And** the color palette, typography, and spacing from `ux-design-specification.md` are configured as Tailwind CSS theme variables.
**And** the custom `Lesson Card` component is created as specified in the UX design.

**Prerequisites:** Story 1.1
**Technical Notes:** Follow the implementation plan from Section 8.1 of `ux-design-specification.md`.

### Story 1.4: User Registration and Email Verification
As a Developer, I want to implement the user registration flow for Instructors and Managers, so that they can create new accounts.

**Acceptance Criteria:**
**Given** a guest on the "Sign Up" page
**When** they fill in their email, password, and select a role (Instructor or Manager) and submit the form
**Then** a new user is created in Supabase `auth.users` table.
**And** a corresponding entry is created in the `profiles` table with the selected role.
**And** the system sends a verification email to the user's email address.
**And** the user is redirected to a page instructing them to check their email.

**Prerequisites:** Story 1.2, 1.3
**Technical Notes:** Use Supabase Auth for user creation and email verification. Integrate with Resend for sending emails as specified in `architecture.md`.

### Story 1.5: User Login and Session Management
As a Developer, I want to implement the user login flow, so that registered users can access the application.

**Acceptance Criteria:**
**Given** a user on the "Log In" page
**When** they enter their correct credentials and submit the form
**Then** their session is authenticated and they are redirected to their role-specific dashboard.
**And** the user's session is maintained across browser refreshes.
**And** incorrect login attempts display a clear error message.

**Prerequisites:** Story 1.4
**Technical Notes:** Use Supabase Auth for login. Implement session management using the Supabase JS client.

### Story 1.6: Implement Role-Based Access Control (RBAC)
As a Developer, I want to implement middleware to protect routes based on user roles, so that users can only access pages they are authorized to see.

**Acceptance Criteria:**
**Given** a logged-in user
**When** they attempt to access a protected route (e.g., a customer trying to access the manager dashboard)
**Then** they are redirected away from the page (e.g., to their own dashboard or a "Not Authorized" page).
**And** RLS policies in Supabase prevent unauthorized data access based on the user's role in the `profiles` table.

**Prerequisites:** Story 1.5
**Technical Notes:** Use Next.js middleware to check user roles based on the session. Implement RLS policies for all major tables in the Supabase database.

### Story 1.7: Instructor Profile Management
As a Developer, I want to build the instructor profile settings page, so that instructors can manage their professional information.

**Acceptance Criteria:**
**Given** a logged-in instructor on their "Profile Settings" page
**When** they update their profile information (certifications, lesson types) and save
**Then** the changes are persisted to the `instructor_details` table.
**And** a success notification is displayed.

**Prerequisites:** Story 1.6
**Technical Notes:** Create a form using React Hook Form and Zod for validation. The page should be under the `(protected)/settings` route group.

### Story 1.8: Instructor Availability Management
As a Developer, I want to implement the instructor's calendar for managing availability, so they can define when they are available to teach.

**Acceptance Criteria:**
**Given** a logged-in instructor on their "Calendar" page
**When** they use the "Add Availability" modal form as defined in the UX spec (Section 3.4.2)
**Then** new entries are created in the `availability` table.
**And** the calendar view updates immediately to show the new availability slots, styled as per the UX spec.
**And** the system prevents the creation of overlapping availability slots for the same instructor (FR008).

**Prerequisites:** Story 1.6
**Technical Notes:** Use the custom `Availability Calendar` component defined in `ux-design-specification.md`. All date/time operations must handle time zones correctly, storing data in UTC.

---

## Epic 2: Customer Booking and Core Scheduling

**Goal:** Implement the end-to-end customer booking flow, from searching for lessons to confirmation, including the initial version of the intelligent scheduling engine.

### Story 2.1: Integrate Weather API
As a Developer, I want to create a serverless function to fetch and cache weather data from the OpenWeatherMap API, so that the system has access to real-time weather for scheduling.

**Acceptance Criteria:**
**Given** the system needs a weather forecast for a specific location and date
**When** the `weather-poller` Edge Function is invoked
**Then** it fetches data from the OpenWeatherMap API.
**And** the relevant forecast data (wind speed, direction, gusts) is stored in a dedicated cache table in Supabase.
**And** the function adheres to the cache-first strategy defined in the architecture, returning cached data if it's recent enough.

**Prerequisites:** Story 1.2
**Technical Notes:** Create a Supabase Edge Function named `weather-poller` as specified in `architecture.md`. Store API keys securely in Supabase secrets.

### Story 2.2: Lesson Search and Filtering UI
As a Customer, I want to filter available lessons by skill level, lesson type, and date, so that I can easily find a lesson that suits me.

**Acceptance Criteria:**
**Given** a user on the public-facing "Book a Lesson" page
**When** they use the search form with filters for "Lesson Type", "Skill Level", and "Date"
**Then** the page dynamically displays a list of available lessons matching the criteria.
**And** each lesson is displayed using the `Lesson Card` custom component.

**Prerequisites:** Story 1.3, 1.8
**Technical Notes:** The search results should be displayed on the same page, updating dynamically below the search form, as per the UX spec.

### Story 2.3: Guest Booking Flow
As a Customer, I want to book a lesson quickly by providing my contact information at the final step, so that the booking process is fast and efficient.

**Acceptance Criteria:**
**Given** a guest has selected a lesson and time from the search results
**When** they click "Book"
**Then** the "Single-Page Booking (in a Modal)" flow is initiated, as defined in the UX spec (Section 3.4.1).
**And** the user fills out their name and email, and accepts the policies (FR012).
**And** upon confirmation, a new entry is created in the `bookings` table and a corresponding `customer_details` entry is created.

**Prerequisites:** Story 2.2
**Technical Notes:** Implement the modal booking flow using the `shadcn/ui` Modal component. Use React Hook Form and Zod for validation.

### Story 2.4: Initial Scheduling Engine
As a Developer, I want to implement the first version of the "Intelligent Scheduling Engine", so that an available and suitable instructor is automatically assigned during booking.

**Acceptance Criteria:**
**Given** a new booking is being created (FR009)
**When** the scheduling engine is invoked
**Then** it queries for instructors who are available at the selected time and can teach the selected lesson type.
**And** it assigns an instructor based on the deterministic tie-breaker algorithm for load balancing defined in `architecture.md`.
**And** the assigned instructor's ID is saved to the `bookings` table.

**Prerequisites:** Story 1.8, 2.3
**Technical Notes:** This logic will be implemented as a Supabase Edge Function named `scheduling-engine`. The function must be timezone-aware as per the architecture document.

### Story 2.5: Booking Confirmation and Summary
As a Customer, I want to see a clear summary before confirming my booking and receive a confirmation number after, so that I can be confident my booking is complete.

**Acceptance Criteria:**
**Given** a customer is in the final step of the booking modal
**When** an instructor has been assigned by the scheduling engine
**Then** the modal displays the booking summary including the assigned instructor, date, time, and a weather summary (FR011).
**And** after clicking "Confirm Booking", the modal content changes to a success message with a unique booking reference number (FR013).

**Prerequisites:** Story 2.4
**Technical Notes:** Generate a user-friendly, unique reference number for each booking.

### Story 2.6: View Booking via Secure Link
As a Guest, I want to view my upcoming and past lessons using a secure link, so that I can easily access my booking details without creating an account.

**Acceptance Criteria:**
**Given** a guest has received a booking confirmation email
**When** they click the "View Booking" link in the email
**Then** they are taken to a page that displays the details of their specific booking.
**And** the link contains a secure, single-use token that expires after a configurable time (FR034).

**Prerequisites:** Story 2.5
**Technical Notes:** Generate a JWT or other secure token for the booking link. Create a new page route `(auth)/booking/[token]` to handle viewing the booking.

### Story 2.7: Support for Multi-Session Bookings
As a Customer, I want to book a multi-day clinic or course in a single transaction, so that the process is convenient.

**Acceptance Criteria:**
**Given** a lesson type is configured as a multi-session course (e.g., 3-day clinic)
**When** a customer books this lesson type
**Then** the system creates a set of linked bookings in the `bookings` table for the correct sequence of dates.
**And** the scheduling engine ensures the same instructor is assigned to all linked sessions, if possible.

**Prerequisites:** Story 2.3
**Technical Notes:** Add a `parent_booking_id` or similar field to the `bookings` table to link multi-session lessons together.

### Story 2.8: Implement CAPTCHA on Booking Form
As a Developer, I want to add a CAPTCHA to the guest booking form, so that we can prevent spam and abuse.

**Acceptance Criteria:**
**Given** a guest is using the booking modal
**When** they are about to confirm the booking
**Then** a non-intrusive CAPTCHA (like reCAPTCHA v3) is present and must be successfully passed.
**And** the booking is only processed if the CAPTCHA validation succeeds on the server-side.

**Prerequisites:** Story 2.3
**Technical Notes:** Implement the CAPTCHA check within the Supabase Edge Function that processes the booking to ensure server-side validation.

---

## Epic 3: Manager and Instructor Dashboards

**Goal:** Provide managers and instructors with the tools they need to manage daily operations, including dashboards, master calendars, and the ability to manage bookings and users.

### Story 3.1: Instructor Dashboard UI
As an Instructor, I want a dashboard that shows my upcoming lessons and current weather, so I can quickly prepare for my day.

**Acceptance Criteria:**
**Given** a logged-in instructor
**When** they navigate to their dashboard page `(protected)/dashboard`
**Then** they see a summary of their lessons for today and tomorrow.
**And** a widget displays the current weather conditions fetched from the weather service.
**And** the layout is responsive and matches the `instructor-dashboard.html` mockup.

**Prerequisites:** Story 1.6, 2.1
**Technical Notes:** The dashboard should be the default page after an instructor logs in. Use TanStack Query to fetch dashboard data efficiently.

### Story 3.2: Manager Dashboard UI
As a Manager, I want a dashboard with an operational overview and key alerts, so I can stay on top of the school's activities.

**Acceptance Criteria:**
**Given** a logged-in manager
**When** they navigate to their dashboard page
**Then** they see an overview of the day's total bookings and instructor availability.
**And** a prominent `Weather Conflict Card` is displayed if any lessons are impacted by weather (FR023, FR027), as specified in the UX spec (Section 5.2.3).
**And** the layout is responsive and matches the `manager-dashboard.html` mockup.

**Prerequisites:** Story 1.6
**Technical Notes:** The dashboard will be the main hub for manager actions. Data should be fetched using TanStack Query.

### Story 3.3: Build Manager Resolution Center UI
As a Manager, I want a dedicated 'Resolution Center' page, so I can view and manage all lessons flagged for weather-related issues in a focused workspace.

**Acceptance Criteria:**
**Given** a manager is on their dashboard and there are weather conflicts
**When** they click the "Review Lessons" button on the `Weather Conflict Card`
**Then** they are navigated to the "Resolution Center" page.
**And** the page lists all lessons with weather conflicts.
**And** each conflict provides options to "Auto-Rebook", "Manual Rebook", or "Cancel Lesson".

**Prerequisites:** Story 3.2
**Technical Notes:** This story implements the UI for the workflow defined in the UX Spec (Section 3.4.3). It is a prerequisite for the rebooking workflow logic.

### Story 3.4: Manager Master Calendar View
As a Manager, I want to view a master calendar of all school activities, so that I have a complete overview of schedules.

**Acceptance Criteria:**
**Given** a logged-in manager
**When** they navigate to the "Calendar" page
**Then** they see a calendar displaying all bookings for the school.
**And** they can filter the view by instructor and lesson type (FR024).
**And** the calendar provides month, week, and day views.

**Prerequisites:** Story 1.6
**Technical Notes:** Implement using the `Availability Calendar` component as a base, but with read-only data from all instructors.

### Story 3.5: Manager Manual Booking Management
As a Manager, I want to manually add, edit, or cancel any booking, so I have full control over the schedule.

**Acceptance Criteria:**
**Given** a manager is viewing the master calendar
**When** they select an existing booking
**Then** they can edit its details (time, instructor, status) or cancel it (FR025).
**When** they select an empty time slot
**Then** they can create a new booking for an existing or new customer.
**And** any manual change triggers the appropriate notifications.

**Prerequisites:** Story 3.4
**Technical Notes:** These actions will require creating new forms and modals. All manual overrides should be logged for auditing purposes.

### Story 3.6: Manager School Settings Configuration
As a Manager, I want to configure school-wide settings, so I can customize the platform to our school's needs.

**Acceptance Criteria:**
**Given** a manager on the "Kite School Settings" page
**When** they update settings like school info, lesson types, or weather rules (FR022, FR031)
**Then** the changes are saved to the `SchoolSettings` table.
**And** the system provides clear validation and warnings if settings are outside normal parameters (FR035).

**Prerequisites:** Story 1.6
**Technical Notes:** Build a dedicated settings page under the `(protected)/settings` route group for managers.

### Story 3.7: Customer and Instructor Management
As a Manager, I want to view and manage all customer and instructor profiles, so that I can handle administrative tasks.

**Acceptance Criteria:**
**Given** a manager navigates to the "People" -> "Customers" page
**When** they use the search and filter controls
**Then** they see a list of customers that they can view or edit (FR028).
**And** the same functionality is available for instructors on the "People" -> "Instructors" page.

**Prerequisites:** Story 1.6
**Technical Notes:** Create list and detail views for both customers and instructors.

### Story 3.8: Handle No-Show and Early Lesson Termination
As an Instructor or Manager, I want to mark a booking as a 'Customer No-Show' or end a lesson prematurely, so that the system's records are accurate.

**Acceptance Criteria:**
**Given** an active or past lesson
**When** an instructor or manager marks it as 'Customer No-Show'
**Then** the `bookings` table status is updated accordingly and a log is created (FR038).
**When** an instructor ends a lesson early
**Then** they can log the actual duration and a reason, which is saved with the booking record (FR039).

**Prerequisites:** Story 3.1, 3.2
**Technical Notes:** Add status fields and a `notes` column to the `bookings` table to accommodate this.

## Epic 4: Notifications, System Resilience, and Edge Cases

**Goal:** Implement the system-wide notification framework, enhance system robustness with fallbacks and logging, and handle critical operational edge cases.

### Story 4.1: Core Notification Service
As a Developer, I want to create a centralized service for sending email and SMS notifications, so that all system communications are handled consistently.

**Acceptance Criteria:**
**Given** a need to send a notification
**When** the notification service is called with a recipient, message, and type (email/SMS)
**Then** it uses the appropriate provider (Resend for email, Twilio for SMS) to send the message.
**And** the service is implemented as a Supabase Edge Function.

**Prerequisites:** Story 1.2
**Technical Notes:** The service should be designed to be called from other Edge Functions or database triggers. API keys must be stored as secrets.

### Story 4.2: Booking Status Notifications
As a User (Customer, Instructor, Manager), I want to receive timely notifications about my bookings, so that I am always up-to-date.

**Acceptance Criteria:**
**Given** a booking is created, changed, or cancelled
**When** the booking status is updated in the database
**Then** a database trigger or function calls the notification service to send an email and SMS to all relevant parties (FR006).
**And** the notification content is relevant to the status change (e.g., "Booking Confirmed", "Lesson Rescheduled").

**Prerequisites:** Story 4.1
**Technical Notes:** Use Supabase database functions (`plpgsql`) to trigger notifications on table updates.

### Story 4.3: Automated Lesson Reminders
As a Customer or Instructor, I want to receive a reminder before my lesson, so that I don't forget.

**Acceptance Criteria:**
**Given** a lesson is scheduled to occur in 24 hours
**When** the scheduled job runs
**Then** the notification service is called to send a reminder email and SMS to the customer and instructor (FR007).

**Prerequisites:** Story 4.1
**Technical Notes:** Use `pg_cron` on Supabase to schedule a job that runs periodically (e.g., every hour) to check for upcoming lessons and trigger reminders.

### Story 4.4: Weather API Fallback Mechanism
As a Developer, I want to implement a fallback for the weather API, so that the system remains operational even if the primary provider is down.

**Acceptance Criteria:**
**Given** the primary weather API (OpenWeatherMap) is unavailable
**When** the `weather-poller` function is invoked
**Then** it attempts to fetch data from a secondary provider or returns the most recent cached data if it's within a reasonable timeframe (FR030).
**And** an alert is logged for the system administrator.

**Prerequisites:** Story 2.1
**Technical Notes:** This enhances the `weather-poller` Edge Function. The choice of secondary API can be a placeholder for now if not defined.

### Story 4.5: Notification Logging and Monitoring
As a Manager, I want a log of all outgoing notifications, so that I can verify that communications were sent and monitor their status.

**Acceptance Criteria:**
**Given** a notification is sent by the notification service
**When** the message is dispatched
**Then** a new entry is created in a `notifications_log` table, including the recipient, message content, type, and delivery status from the provider (FR032).
**And** managers can view this log in a dedicated section of the admin dashboard.

**Prerequisites:** Story 4.1
**Technical Notes:** The notification service function needs to be updated to write to the log table.

### Story 4.6: Manager Confirmation for Automated Rebooking
As a Manager, I want to have the final say on all automated rebookings, so that I maintain control over the schedule.

**Acceptance Criteria:**
**Given** the system has proposed a rebooking solution due to weather
**When** the manager is in the "Resolution Center"
**Then** they must click a final "Confirm and Notify Users" button after choosing a rebooking option.
**And** no notifications are sent to customers or instructors until this final confirmation is given (FR036).

**Prerequisites:** Story 3.3
**Technical Notes:** This workflow is part of the "Resolution Center" UI. The front-end will orchestrate the two-step confirmation process, only calling the final notification trigger after manager approval.

---

## FR Coverage Matrix



This matrix provides a detailed mapping of each Functional Requirement (FR) to the specific user story that implements it, ensuring all requirements are covered.



| FR #  | Requirement Summary                               | Epic | Story |

| :---- | :------------------------------------------------ | :--- | :---- |

| FR001 | Role-based access control                         | 1    | 1.6   |

| FR002 | User registration with email verification         | 1    | 1.4   |

| FR003 | User login                                        | 1    | 1.5   |

| FR004 | Integrate with weather API                        | 2    | 2.1   |

| FR005 | Intelligent scheduling engine logic               | 2    | 2.4   |

| FR006 | Email and SMS notifications                       | 4    | 4.2   |

| FR007 | Automatic lesson reminders                        | 4    | 4.3   |

| FR008 | Prevent instructor schedule overlap               | 1    | 1.8   |

| FR009 | Guest booking process                             | 2    | 2.3   |

| FR010 | Filter available lessons                          | 2    | 2.2   |

| FR011 | Show booking summary before confirmation          | 2    | 2.5   |

| FR012 | Display and accept policies before booking        | 2    | 2.3   |

| FR013 | Confirmation screen with booking reference        | 2    | 2.5   |

| FR014 | Manage rebooking proposals via email link         | 2    | 2.6   |

| FR015 | View lessons via secure link                      | 2    | 2.6   |

| FR016 | Instructor profile management                     | 1    | 1.7   |

| FR017 | Instructor dashboard                              | 3    | 3.1   |

| FR018 | Instructor interactive calendar                   | 1    | 1.8   |

| FR019 | Instructor availability management                | 1    | 1.8   |

| FR020 | Instructors create new lessons                    | 1    | 1.8   |

| FR021 | Instructors rebook or cancel lessons              | 1    | 1.8   |

| FR022 | Manager school settings configuration           | 3    | 3.6   |

| FR023 | Manager dashboard and alerts                      | 3    | 3.2   |

| FR024 | Manager master calendar view                      | 3    | 3.4   |

| FR025 | Manager manual booking management               | 3    | 3.5   |

| FR026 | Manager manual instructor assignment              | 3    | 3.5   |

| FR027 | Manager weather alerts and proposals            | 3    | 3.2   |

| FR028 | Manager customer/instructor list management     | 3    | 3.7   |

| FR029 | Manager direct/broadcast messaging              | 4    | 4.1   |

| FR030 | Weather API fallback mechanism                    | 4    | 4.4   |

| FR031 | Manager configuration of scheduling logic         | 3    | 3.6   |

| FR032 | Log all outgoing notifications                    | 4    | 4.5   |

| FR033 | CAPTCHA on guest booking form                     | 2    | 2.8   |

| FR034 | Single-use, expiring rebooking links              | 2    | 2.6   |

| FR035 | Validation/warnings on manager settings           | 3    | 3.6   |

| FR036 | Manager final confirmation for rebookings         | 4    | 4.6   |

| FR037 | Mark 'Instructor No-Show'                         | 3    | 3.8   |

| FR038 | Mark 'Customer No-Show'                           | 3    | 3.8   |

| FR039 | Log premature lesson endings                      | 3    | 3.8   |

| FR040 | Support multi-session bookings                    | 2    | 2.7   |



---



## Summary



The project has been broken down into 4 epics and 30 user stories. This breakdown covers all functional requirements outlined in the PRD and incorporates key decisions from the architecture and UX design specifications. The epic and story structure is designed to deliver incremental value, starting with a foundational application and culminating in a feature-rich platform for customers, instructors, and managers.



This `epics.md` document now serves as the primary blueprint for Phase 4 (Implementation).



---



_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._



_This document will be updated after UX Design and Architecture workflows to incorporate interaction details and technical decisions._


