# IBE160 Product Requirements Document (PRD)

**Author:** BIP
**Date:** 2025-11-06
**Project Level:** 3
**Target Scale:** Complex system with multiple user roles and automated scheduling

---

## Goals and Background Context

### Goals

*   Reduce manual scheduling and coordination.
*   Increase instructor utilization.
*   Enable customers to book a lesson in under 3 minutes.
*   Allow instructors to manage their availability and view their schedule with no more than 2 clicks.
*   Provide managers with a clear overview of the day's schedule and resource allocation in a single dashboard view.

### Background Context

Kite schools operate in a dynamic environment where weather conditions are unpredictable. The current process of managing bookings, scheduling instructors, and communicating with students is often manual, fragmented, and inefficient. This leads to operational overhead, scheduling conflicts, and a suboptimal experience for both customers and staff.

KiteOps will be a centralized platform that provides a simple and intuitive way for customers to book lessons, for instructors to manage their availability, and for managers to have a comprehensive overview of all school operations. Its key differentiator is an **intelligent, rule-based automation engine** designed to handle the complexities of weather-dependent scheduling, significantly reducing manual overhead and optimizing resource utilization, which is a common pain point in the industry.

---

## Requirements

### Functional Requirements

**General & System**
*   FR001: The system shall provide role-based access control for Guest, Customer, Instructor, and Manager roles. (Scope: MVP)
*   FR002: The system shall allow users to register for Instructor or Manager accounts with email verification. (Scope: MVP)
*   FR003: The system shall allow registered users to log in. (Scope: MVP)
*   FR004: The system shall integrate with a weather API to fetch real-time weather data for scheduling. (Scope: MVP)
*   FR005: The system's intelligent scheduling engine shall consider student skill level, weather suitability, and instructor load balancing when assigning instructors. (Dependencies: FR004, FR019) (Scope: MVP)
*   FR006: The system shall automatically send email and SMS notifications to all relevant parties (customer, instructor, manager) for booking confirmations, changes, and cancellations. (Scope: MVP)
*   FR007: The system shall send automatic lesson reminders to customers and instructors (e.g., 24 hours prior). (Scope: MVP)
*   FR008: The system shall perform an overlap check to prevent an individual instructor from creating conflicting entries on their own calendar. (Scope: MVP)

**Guest & Customer**
*   FR009: Unregistered guests shall be able to start the booking process by providing contact information at the final confirmation step. (Scope: MVP)
*   FR010: Customers shall be able to filter available lessons by skill level, lesson type, and date. (Scope: MVP)
*   FR011: Customers shall be shown a booking summary with assigned instructor, date, time, location, and weather summary before confirming. (Scope: MVP)
*   FR012: Customers must accept cancellation, rebooking, and refund/credit policies before confirming a booking. These policies must be clearly displayed. (Scope: MVP)
*   FR013: Customers shall receive a confirmation screen with a booking reference number after a successful booking. (Scope: MVP)
*   FR014: Customers shall be able to manage system-initiated rebooking proposals (e.g., due to weather) via a dedicated link sent by email. (Scope: MVP)
*   FR015: Guests who have booked lessons shall be able to view their upcoming and past lessons via a secure link or booking reference. (Scope: MVP)

**Instructor**
*   FR016: Instructors shall be able to create and manage a professional profile including certifications, lesson types they can teach, and availability preferences. (Scope: MVP)
*   FR017: Instructors shall have a dashboard displaying a summary of today's and upcoming lessons, and current weather. (Scope: MVP)
*   FR018: Instructors shall be able to view and manage their schedule on an interactive calendar with month, week, day, and agenda views. (Scope: MVP)
*   FR019: Instructors shall be able to add, modify, or remove their availability and block off personal time and recurrence (e.g., every Monday, weekly, bi-weekly). (Scope: MVP)
*   FR020: Instructors shall be able to create new lessons for new or existing students. (Scope: MVP)
*   FR021: Instructors shall be able to rebook or cancel lessons from their calendar. (Scope: MVP)

**Manager**
*   FR022: Managers shall be able to configure school-wide settings, including weather parameters, lesson types, and the school logo. (Scope: MVP)
*   FR023: Managers shall have a dashboard with an operational overview, instructor availability summary, and rebooking alerts. (Scope: MVP)
*   FR024: Managers shall be able to view a master calendar with filtering options for instructors and lesson types. (Scope: MVP)
*   FR025: Managers shall be able to manually add, edit, or cancel any booking in the system. (Scope: MVP)
*   FR026: Managers shall be able to manually assign or reassign instructors to lessons, overriding any suggestions from the intelligent scheduling engine. (Scope: MVP)
*   FR027: The system shall alert managers to lessons impacted by bad weather and propose rebooking solutions. (Scope: MVP)
*   FR028: Managers shall be able to view, search, and filter a list of all customers and manage their profiles. (Scope: MVP)
*   FR029: Managers shall be able to send broadcast or direct messages to customers and instructors. (Scope: MVP)

**Risk Mitigation & Edge Cases**
*   FR030: The system must have a fallback mechanism in case the primary weather API is unavailable, such as using a secondary API or cached data. (Scope: MVP)
*   FR031: The scheduling engine's logic must be transparent and configurable by the Manager, with an option for manual override. (Scope: MVP)
*   FR032: The system must log all outgoing notifications and provide a way to monitor their delivery status. (Scope: MVP)
*   FR033: The system should implement rate limiting or a CAPTCHA on the guest booking form to prevent abuse. (Scope: MVP)
*   FR034: Rebooking links sent to users must be single-use and expire after a configurable amount of time to ensure security. (Scope: MVP)
*   FR035: The system shall provide clear validation and warnings when a Manager configures settings outside of normal parameters. (Scope: MVP)
*   FR036: All automated rebookings must require a final confirmation from a Manager before notifications are sent to customers. (Scope: MVP)
*   FR037: The system shall allow a Manager to mark a lesson as 'Instructor No-Show' and trigger an emergency re-assignment or cancellation workflow. (Scope: MVP)
*   FR038: The system shall allow an Instructor or Manager to mark a booking as 'Customer No-Show', and this status should be logged for reporting and potential billing. (Scope: MVP)
*   FR039: The system shall allow an Instructor to end a lesson prematurely and log the actual duration, with a note explaining the reason (e.g., "Ended after 45 mins due to high wind"). (Scope: MVP)
*   FR040: The system shall support the creation of multi-session bookings (e.g., a 3-day clinic) for a single student or group. (Scope: MVP)

### Non-Functional Requirements

*   **NFR01 (Performance):** All user-facing pages and dashboards shall load in under 3 seconds. Critical actions, such as booking or updating availability, shall be confirmed to the user in under 2 seconds.
*   **NFR02 (Usability):** The system shall be intuitive for all user roles. A new user should be able to complete their primary goal (e.g., booking a lesson, setting availability) without requiring training or documentation.
*   **NFR03 (Security):** All user data, especially personal information and passwords, must be encrypted in transit and at rest. The system must follow best practices for authentication and authorization to prevent unauthorized access.
*   **NFR04 (Compliance):** The system must be fully GDPR compliant, including mechanisms for user data access, export, and deletion requests.
*   **NFR05 (Reliability):** The core booking system shall have an uptime of 99.9%. The system must be resilient to failures in external services, such as the weather API, by using fallbacks and caching.

---

## User Journeys

#### 1. Customer Journey (Guest Booking)

*   **Backbone:** Discover & Start Booking → Find a Lesson → Book a Lesson → Manage Booking → Attend Lesson.
*   **Optimized Flow:** The user arrives on the site and immediately sets search parameters to see available lessons. They select a slot and review a summary. Only at the final confirmation step are they asked to enter contact info and accept policies. After booking, all confirmations and notifications are handled via email and SMS.

#### 2. Instructor Journey

*   **Backbone:** Sign Up → Set Up Profile → Dashboard → Calendar View → Manage Availability → Manage Lessons → Handle Changes.
*   **Optimized Flow:** The instructor signs up and completes their profile. Their dashboard is mobile-optimized and "glanceable," featuring tabs for "Today" and "Tomorrow's" schedule. To manage availability, they can click and drag directly on their calendar to create or modify time blocks, reducing clicks.

#### 3. Manager Journey

*   **Backbone:** Sign Up → Kite School Settings → Dashboard → Calendar Overview → Manage Bookings → Handle Rebooking → Instructor Coordination → View Customers.
*   **Optimized Flow:** The manager signs up and configures school settings. Their dashboard features a prominent "Action Items" queue for pending approvals. The main navigation is structured into Dashboard, Calendar, People (Instructors/Customers), and Settings. For reassignments, they can enter a "Reassign Mode" on the calendar to drag and drop lessons between instructors.

---

## UX and UI Vision

### 1. UX Principles

*   **Clarity and Efficiency:** The interface will be clean, uncluttered, and optimized for speed.
*   **Role-Specific Dashboards:** Each user role will have a tailored dashboard that surfaces the most relevant information and actions.
*   **Data-Informed Decisions:** The UI will present complex information in a simple, graphical way to help users make informed decisions.
*   **Trust and Transparency:** The system will be transparent about its automated decisions and policies to build user trust.

### 2. Platform, Screens & Architecture

*   **Platform:** A responsive web application (Next.js) accessible on desktop and mobile.
*   **Global Navigation:** A persistent top navigation bar will provide a link to the main dashboard and a user profile icon with a dropdown for "Profile Settings" and "Logout".
*   **Instructor Navigation:** The main navigation will consist of: **Dashboard**, **Calendar**, and **Profile**.
*   **Manager Navigation:** The main navigation will be structured as: **Dashboard**, **Calendar**, **People** (with an Instructors/Customers sub-menu), and **Settings**.
*   **Manager Calendar:** Will include a "Heat Map View" to visualize booking density.

#### API & Data Models
*   **API:** RESTful API built on Supabase (PostgREST) for data access and real-time subscriptions.
*   **Data Models:** Core entities include `Users` (with roles), `Customers`, `Instructors`, `Lessons`, `Bookings`, `Availability`, `Notifications`, and `SchoolSettings`. Detailed schema to be defined in the architecture phase.

#### Mobile Considerations
*   **Responsive Design:** All interfaces will be fully responsive, adapting to various mobile screen sizes (NFR02).
*   **Touch-Optimized Interactions:** Key interactions (e.g., calendar drag-and-drop for availability) will be optimized for touch input.
*   **Offline Capabilities:** Limited offline capabilities for viewing schedules (e.g., cached data) will be explored for instructors in areas with poor connectivity.

### 3. Design Constraints

*   **Framework:** Next.js 14+ with App Router.
*   **Styling:** Tailwind CSS.
*   **Forms:** React Hook Form with Zod validation.
*   **Authentication:** Supabase Auth UI components with custom styling.

---

## Implementation Dependencies

This mapping clarifies the logical build order for the project.

*   **Foundation Layer:** The first features to be built are the core user authentication (FR001-FR003) and the instructor profile/availability management (FR016, FR019).
*   **Central Hub - The Scheduling Engine:** The "Intelligent Scheduling Engine" (FR005) is the most critical component, connecting weather data, instructor skills, and availability. It depends on the Foundation Layer.
*   **Dependent Flows:** All customer booking flows and manager oversight features rely on the Foundation Layer and the Scheduling Engine being in place.
*   **DevOps & Test Strategy:** Detailed DevOps practices and test strategies will be documented in a separate artifact if the Enterprise Method is formally adopted, ensuring comprehensive coverage for deployment and quality assurance.

---

## Innovation and Validation

The core innovation of KiteOps lies in its **Intelligent Scheduling Engine**. This engine utilizes a rule-based approach to optimize lesson assignments by considering dynamic factors like real-time weather, student skill levels, and instructor availability.

**Validation Approach:**
*   **Rule-based Logic Testing:** Thorough unit and integration testing of the scheduling engine's algorithms to ensure rules are applied correctly.
*   **Scenario Simulation:** Simulation of various booking and weather scenarios to validate the engine's decision-making and efficiency.
*   **User Acceptance Testing (UAT):** Managers will validate the engine's suggestions and manual override capabilities in real-world conditions.
*   **Performance Monitoring:** Key metrics such as instructor utilization rates and customer booking completion times will be monitored post-launch to measure the engine's effectiveness against the stated goals.

---

## Technical Unknowns

*   **Scheduling Engine Scalability:** The long-term scalability of the intelligent scheduling engine under heavy load (e.g., hundreds of simultaneous booking requests or complex rebooking scenarios) requires further investigation and performance testing.
*   **Weather API Rate Limits:** Potential limitations and costs associated with high-volume calls to the integrated weather API need to be assessed.

---

## Epic List

*   **Epic 1: Foundation & Instructor Setup**
    *   **Goal:** Establish the project foundation with core user authentication and provide instructors with the ability to set up their profiles and manage their availability.
    *   **Estimated Story Count:** 8-12 stories.

*   **Epic 2: Core Booking & Scheduling Engine**
    *   **Goal:** Implement the intelligent scheduling engine and the end-to-end guest booking flow, allowing customers to book lessons based on real-time weather and instructor availability.
    *   **Estimated Story Count:** 10-15 stories.

*   **Epic 3: Manager Oversight & Administration**
    *   **Goal:** Empower managers with a comprehensive dashboard and master calendar to oversee all school operations, manage bookings, and coordinate instructors.
    *   **Estimated Story Count:** 10-15 stories.

---

## Out of Scope

The following features and capabilities are explicitly out of scope for the initial MVP but may be considered for future releases.

**Core Functionality:**
*   **Payments:** Full payment integration for lessons and rentals.
*   **Gear Rental:** Integrated gear rental and inventory tracking.
*   **Waitlists:** A waitlist management system for fully booked sessions.
*   **Lesson Packages:** The ability to create and purchase discounted lesson bundles.

**Automation & AI:**
*   **Advanced AI Optimization:** The MVP includes a rule-based scheduling engine. More advanced, learning-based optimization is out of scope.
*   **AI Manager's Co-Pilot:** Advanced co-pilot features such as daily briefing summaries and conversational commands are out of scope.
*   **Fully Automated Rebooking:** The MVP includes manager-driven rebooking suggestions. A fully automated system is a future feature.
*   **AI Communication Insights:** Features such as sentiment analysis of messages are out of scope.

**User Roles & Profiles:**
*   **Extended Roles:** Roles such as 'owner', 'receptionist', or 'beach staff'.
*   **Public Instructor Profiles:** Public-facing profile pages are a future feature.

**Integrations & Dashboards:**
*   **Google Calendar Sync:** Two-way synchronization with Google Calendar.
*   **Financial Dashboards:** Detailed financial reporting and dashboards.
*   **Instructor Coupons:** A system for instructor-specific coupon codes and referral tracking.
