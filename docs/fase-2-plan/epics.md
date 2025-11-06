# IBE160 - Epic Breakdown

**Author:** BIP
**Date:** 2025-11-06
**Project Level:** 3
**Target Scale:** Complex system with multiple user roles and automated scheduling

---

## Overview

This document provides the detailed epic breakdown for IBE160, expanding on the high-level epic list in the [PRD](./PRD.md).

Each epic includes:

- Expanded goal and value proposition
- Complete story breakdown with user stories
- Acceptance criteria for each story
- Story sequencing and dependencies

**Epic Sequencing Principles:**

- Epic 1 establishes foundational infrastructure and initial functionality
- Subsequent epics build progressively, each delivering significant end-to-end value
- Stories within epics are vertically sliced and sequentially ordered
- No forward dependencies - each story builds only on previous work

---

### Epic 1: Foundation & Instructor Setup

**Expanded Goal:** To create the core infrastructure of the application, including project setup, database schema, and a complete user authentication system. This epic will deliver the foundational features that allow an instructor to register, create a detailed professional profile, and manage their teaching availability on a calendar.

**Stories:**

*   **Story 1.1: Project & Database Setup**
    *   As a Developer, I want to initialize the Next.js project and create the core database schema for all user roles, so that we have a foundation for user management.
    *   **Acceptance Criteria:**
        1.  A new Next.js project is created and configured with Supabase and Tailwind.
        2.  The database schema is created in Supabase, including tables for `User Profiles`, `Customers`, `Instructors`, `Managers`, and `Availability Calendar`.
        3.  The initial table structures will be based on the "Data Requirements" section of the `proposal.md` document.

*   **Story 1.2: User Registration & Login**
    *   As a User, I want to be able to register for an account (as a Customer, Instructor, or Manager) and log in, so that I can access the system.
    *   **Acceptance Criteria:**
        1.  A user can register with an email and password.
        2.  The system sends a verification email.
        3.  A registered user can log in and is directed to a basic, role-specific landing page.

*   **Story 1.3: Instructor Profile Creation**
    *   As an Instructor, I want to complete my professional profile after my first login, so that the system knows my qualifications.
    *   **Acceptance Criteria:**
        1.  After their first login, an instructor is prompted to complete their profile.
        2.  The profile includes fields for certifications, lesson types they can teach, and availability preferences.
        3.  The completed profile is saved to the database.

*   **Story 1.4: Instructor Availability Management**
    *   As an Instructor, I want to add, view, and manage my availability on an interactive calendar, so that the system knows when I can teach.
    *   **Acceptance Criteria:**
        1.  An instructor can access their calendar.
        2.  They can create availability blocks by clicking and dragging on the calendar.
        3.  They can add recurrence rules (e.g., weekly) to availability blocks.
        4.  The system prevents an instructor from creating conflicting entries on their own calendar.

*   **Story 1.5: Basic Instructor Dashboard**
    *   As an Instructor, I want to see a simple, mobile-friendly dashboard with my schedule for today and tomorrow, so that I can quickly see my upcoming work.
    *   **Acceptance Criteria:**
        1.  The instructor dashboard is the landing page after login.
        2.  It displays a "glanceable" view of the schedule for today and tomorrow.
        3.  The dashboard is optimized for mobile viewing.

*   **Story 1.6: Initial School Configuration**
    *   As a Manager, I want to configure the basic settings for my kite school after my first login, so that the system is set up for scheduling and branding.
    *   **Acceptance Criteria:**
        1.  After their first login, a manager is prompted to complete the school setup.
        2.  The manager can define core lesson types and their default durations.
        3.  The manager can set the core weather parameters (min/max wind speed) for the scheduling engine.
        4.  The manager can upload the school's logo to be displayed in the application.

*   **Story 1.7: Basic Customer Role**
    *   As a Developer, I want to set up the basic shell for the Customer role, so that they can log in and see a placeholder dashboard.
    *   **Acceptance Criteria:**
        1.  A user can register as a Customer.
        2.  After login, they are taken to a basic dashboard indicating their role.

---

### Epic 2: Core Booking & Scheduling Engine

**Expanded Goal:** To implement the core logic of the application, including the weather API integration and the rule-based scheduling engine. This epic will deliver a complete, end-to-end booking experience for a guest user, from searching for a lesson to receiving a confirmation.

**Stories:**

*   **Story 2.1: Weather API Integration**
    *   As a Developer, I want to integrate with the OpenWeatherMap API, so that the system has access to real-time weather forecasts for scheduling.
    *   **Acceptance Criteria:**
        1.  The system can fetch and store weather data for the school's location.
        2.  A fallback mechanism is in place for when the API is unavailable.

*   **Story 2.2: Implement Scheduling Engine V1**
    *   As a Developer, I want to build the first version of the intelligent scheduling engine that optimizes for instructor skill utilization.
    *   **Acceptance Criteria:**
        1.  The engine's weather check is only applied to bookings scheduled within the next 7 days.
        2.  The engine filters the pool of available instructors to only those qualified to teach the selected lesson type.
        3.  When assigning an instructor to a beginner lesson, the engine must prioritize instructors who are only qualified for beginner lessons.
        4.  If multiple instructors are still available, the engine will use a simple load-balancing rule to make the final assignment.
        5.  The engine's decision logic is logged.

*   **Story 2.3: Guest Booking - Lesson Selection**
    *   As a Guest, I want to search for lessons and see a list of available time slots, so that I can choose a lesson that works for me.
    *   **Acceptance Criteria:**
        1.  A guest can filter lessons by date, skill level, and lesson type.
        2.  The system uses the Scheduling Engine to display a list of available time slots.
        3.  A warning is displayed if the weather API is down.

*   **Story 2.4: Guest Booking - Confirmation**
    *   As a Guest, I want to select a time slot, provide my contact details, and confirm my booking, so that my lesson is reserved.
    *   **Acceptance Criteria:**
        1.  After selecting a slot, the user is shown a summary with the assigned instructor and lesson details.
        2.  The user must enter their contact information and accept the cancellation/refund policies.
        3.  Upon confirmation, the booking is created.

*   **Story 2.5: Booking Notifications**
    *   As a User (Customer, Instructor, or Manager), I want to receive an email/SMS notification when a booking is created, so that everyone is aware of the new lesson.
    *   **Acceptance Criteria:**
        1.  When a booking is confirmed, an automated notification is sent to the customer, instructor, and manager.
        2.  The system logs the status of all outgoing notifications.

---

### Epic 3: Manager Oversight & Administration

**Expanded Goal:** To empower the school manager with a centralized dashboard and master calendar to oversee all operations. This includes manually managing bookings, coordinating instructors, handling weather-related rebookings, and communicating with users.

**Stories:**

*   **Story 3.1: Manager Dashboard & Action Queue**
    *   As a Manager, I want a dashboard with an operational overview and a clear "Action Items" queue, so I can immediately see the status of my school and what requires my attention.
    *   **Acceptance Criteria:**
        1.  The dashboard is the manager's landing page.
        2.  It displays a summary of today's lessons and instructor availability.
        3.  It features a prominent "Action Items" queue for pending approvals.

*   **Story 3.2: Master Calendar View**
    *   As a Manager, I want to view a master calendar of all bookings and availability with powerful filtering and visualization tools, so I can have a complete overview of my operations.
    *   **Acceptance Criteria:**
        1.  The manager can access a master calendar view.
        2.  The calendar displays all lessons and instructor availability.
        3.  The manager can filter the view by instructor and lesson type.
        4.  The calendar includes a "Heat Map View" to visualize booking density.

*   **Story 3.3: Manual Booking Management**
    *   As a Manager, I want to be able to manually add, edit, and cancel any booking, overriding the scheduling engine if necessary, so I have full control over the schedule.
    *   **Acceptance Criteria:**
        1.  From the calendar, a manager can create a new booking for any customer.
        2.  A manager can edit any detail of an existing booking.
        3.  A manager can manually assign or reassign an instructor, overriding any system suggestions.

*   **Story 3.4: User Management**
    *   As a Manager, I want to be able to view and manage the profiles of all customers and instructors, so I can maintain user records.
    *   **Acceptance Criteria:**
        1.  A manager can access searchable lists of all customers and instructors.
        2.  They can view and edit the profile details for any user.

*   **Story 3.5: Weather Rebooking Workflow**
    *   As a Manager, I want the system to alert me to lessons at risk due to bad weather and let me approve the proposed rebookings, so I can proactively manage my schedule.
    *   **Acceptance Criteria:**
        1.  The system flags at-risk bookings and places them in the manager's "Action Items" queue.
        2.  The manager can review the system's suggested new time slots.
        3.  With the manager's approval, the rebooking is confirmed and notifications are sent.

*   **Story 3.6: Broadcast Communication**
    *   As a Manager, I want to send broadcast messages to groups of users (e.g., all instructors), so I can communicate important information efficiently.
    *   **Acceptance Criteria:**
        1.  A manager can compose a message and select a recipient group.
        2.  The system shows a confirmation step with the recipient count before sending.
        3.  The message is sent via email and/or in-app notification.

---

## Story Guidelines Reference

**Story Format:**

```
**Story [EPIC.N]: [Story Title]**

As a [user type],
I want [goal/desire],
So that [benefit/value].

**Acceptance Criteria:**
1. [Specific testable criterion]
2. [Another specific criterion]
3. [etc.]

**Prerequisites:** [Dependencies on previous stories, if any]
```
