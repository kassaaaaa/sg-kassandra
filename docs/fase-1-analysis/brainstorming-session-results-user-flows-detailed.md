# Brainstorming Session Results - Detailed User Flows (MVP)

**Session Date:** 2025-10-29
**Facilitator:** Strategic Business Analyst Mary
**Participant:** BIP
**Topic:** Detailed User Flows for KiteOps (Customer, Instructor, Manager)

## Executive Summary

This document captures the detailed User Story Maps for the Minimum Viable Product (MVP) of the KiteOps booking system, covering the core user journeys for Customers, Instructors, and Managers. Each flow outlines the key backbone stages and the specific actions users will take within each stage.

---

### 1. Customer User Story Map (MVP - Guest Booking Only)

**Backbone:**

1.  Discover & Start Booking (as Guest)
2.  Find a Lesson
3.  Book a Lesson
4.  Manage Booking (via Email/Separate Page)
5.  Attend Lesson

**Detailed Steps:**

**1. Discover & Start Booking (as Guest)**

- Customer visits KiteOps homepage.
- Customer clicks "Book a Lesson" button.
- Customer is redirected to a page to start the booking process as a Guest.
- Customer provides necessary contact information (e.g., email, phone) to receive booking confirmations and updates.

**2. Find a Lesson**

- Customer sets search parameters:
  - Skill level (Beginner/Intermediate/Advanced)
  - Lesson type (private/group/refresher)
  - Specific date
- System fetches and displays available time slots and instructors based on the intelligent scheduling logic (considering skill match, weather suitability, and instructor load balancing).
  - Real-time Instructor availability.
  - Weather/tide forecast for selected window.

**3. Book a Lesson**

- User reviews available time slots.
- User selects a preferred time slot.
- System automatically assigns the best-matched Instructor based on the intelligent scheduling logic (considering skill match, weather suitability, and instructor load balancing).
- User clicks "Continue to Review".
- User sees booking summary:
  - Assigned Instructor, date, time, duration, location.
  - Weather/tide summary for the slot.
  - Total price (if payment enabled).
- User confirms policies (cancellation, reschedule).
- User clicks "Confirm Booking".

**4. Manage Booking (via Email/Separate Page - MVP Context)**

- **Confirmation & Notifications:**
  - Confirmation screen shows reference number and details.
  - Email + SMS confirmation sent automatically to all parties (customer, instructor, manager).
- **System-Initiated Rescheduling or Weather-Based Rebooking (via email to separate page):**
  - If forecast degrades, system proposes alternate slots.
  - Customer receives an email with a link to an interactive separate page.
  - On this page, the Customer can:
    - Accept proposed slot.
    - Choose different slot.
    - Cancel for credit (per policy).
  - Upon selection, all parties notified and calendars updated.

**5. Attend Lesson (MVP Context)**

- Customer receives automatic reminder via email/SMS (e.g., T-24h).
- Customer attends the lesson.
- Lesson is completed.

---

### 2. Instructor User Story Map (MVP)

**Backbone:**

1.  Discover & Sign Up
2.  Set Up Profile
3.  Instructor Dashboard
4.  Calendar View
5.  Manage Availability
6.  View & Manage Lessons
7.  Handle Changes (Rebooking/Cancellations)
8.  Daily Overview

**Detailed Steps:**

**1. Discover & Sign Up**

- Instructor navigates to KiteOps homepage.
- Instructor clicks "Login / Register".
- New Instructor clicks "Create Instructor Account".
- New Instructor enters name, email, password.
- New Instructor receives verification email and clicks confirmation link.
- Returning Instructor logs in using email and password.
- System automatically detects Instructor role (via user_id or email) after login/registration.

**2. Set Up Profile**

- First-time Instructor completes professional profile:
  - Name, photo, certifications.
  - IKO profile link.
  - Spoken languages.
  - Selects qualified `Lesson Types` from the following list:
    - Private Lesson - Beginner
    - Private Lesson - Intermediate
    - Private Lesson - Advanced
    - Group Lesson - Beginner
    - Group Lesson - Intermediate
    - Group Lesson - Advanced
    - Refresher Lesson
    - Freestyle Lesson
  - Availability preferences (days/times).
- Instructor saves profile.
- Instructor is redirected to Instructor Dashboard.

**3. Instructor Dashboard**

- Instructor accesses the Instructor Dashboard.
  - The dashboard displays:
    - Summary cards: "Today's lessons (number)", "Upcoming lessons (number)", "Total lessons taught (number)".
    - "Today's Schedule" (a day-calendar view).
    - Weather for today (shown graphically with emojis and numbers, e.g., ☀️ 15°C, 💨 15-20 knots NE).
    - Buttons: "View Calendar" (to access the full interactive calendar) and "Add Lesson".
    - "Weather & Wind Summary for the week" button.
  - The top navigation includes a Profile icon, which, when clicked, reveals a dropdown/pop-up displaying the Instructor's Name, Email, Role, and links to the full "Profile" settings page and "Logout" action.

**4. Calendar View**

- Instructor clicks "View Calendar" button on the Instructor Dashboard.
- Instructor views interactive weekly/monthly calendar.
- At the top of the site (within the Calendar View), two buttons are present: "Add availability" and "Block time".
- Instructor can toggle the calendar view between Month, Week, Day, and Agenda.
- Alongside the calendar view toggle, there are "Today", "Back", and "Next" buttons for navigation.
- A color-coded legend is displayed, explaining what each color represents (e.g., Green = Available, Blue = Confirmed lesson, Yellow = Pending booking, Grey = Unavailable time).
- The calendar displays:
  - Confirmed lessons (color-coded, e.g., Blue).
  - Pending bookings (color-coded, e.g., Yellow).
  - Unavailable times (color-coded, e.g., Grey).
  - Available slots (color-coded, e.g., Green).
  - When in Agenda view, only confirmed and pending lessons are displayed.
- Instructor can click on any lesson to view its details, which include:
  - **Lesson Details:**
    - Lesson type (e.g., Private, Group, Freestyle).
    - Date and Time.
    - Duration.
    - Location.
  - **Student Details:**
    - Student Name.
    - Skill Level.
    - Age.
    - Gender.
    - Experience (years or prior lessons).
    - Country/Region.
    - Language spoken.
- [Nice-to-have]: Ability to sync calendar with Google Calendar.

**5. Manage Availability**

- Instructor clicks "Add availability" or "Block time" button (from Calendar View or Dashboard).
- Instructor is presented with an interface to:
  - Add new availability slots (e.g., selecting dates/times, setting recurring availability).
  - Modify existing availability slots.
  - Block off specific personal days or unavailable times.
- Instructor specifies details for availability/blocked time:
  - Date(s) and time range.
  - Reason (optional, for blocked time).
  - Recurrence (e.g., every Monday, weekly, bi-weekly).
- System performs an overlap check:
  - Validates that the new/modified availability, blocked time, or course does not overlap with any existing entries.
  - If an overlap is detected, the system alerts the instructor and prevents saving until the conflict is resolved.
- Instructor reviews and confirms changes.
- Instructor clicks "Save Availability".
- Calendar view updates to reflect changes.
- Instructor can click on an existing availability or blocked time event in the calendar.
  - A pop-up or context menu appears with options:
    - "Edit" (to modify the event details).
    - "Remove" (to delete the event).
    - "Close" (to dismiss the pop-up/menu).

**6. View & Manage Lessons**

- Instructor clicks "Add Lesson" button (from Dashboard).
- Instructor is presented with options to:
  - **Add a lesson for a New Student:**
    - Instructor chooses date, time, and lesson type.
    - Instructor enters student details (name, contact, skill level).
    - System validates instructor availability (ensuring no overlaps with existing bookings/blocked times).
    - Instructor confirms lesson.
    - System sends invitation/confirmation to student and manager.
  - **Add a lesson for an Existing Student:**
    - Instructor chooses date, time, and lesson type.
    - Instructor selects student from a list.
    - System validates instructor availability (ensuring no overlaps with existing bookings/blocked times).
    - Instructor confirms lesson.
    - System sends invitation/confirmation to student and manager.
  - **Add a Group Lesson:**
    - Instructor chooses date, time, and lesson type (specifically a group lesson type).
    - Instructor adds multiple students under one session (selecting from existing students or adding new ones).
    - System validates instructor availability (ensuring no overlaps with existing bookings/blocked times).
    - Instructor confirms lesson.
    - System sends invitation/confirmation to students and manager.
- Instructor can view details of any lesson (as defined in Calendar View).
- Instructor can modify a lesson (e.g., change time, date, student, lesson type).
  - System validates instructor availability (ensuring no overlaps with existing bookings/blocked times).
  - System sends notifications for changes.

**7. Handle Changes (Rebooking/Cancellations)**

- Instructor identifies a lesson requiring rebooking or cancellation (e.g., due to weather, student request, or scheduling conflict).
- Instructor accesses the lesson details (e.g., by clicking on it in the Calendar View).
- Instructor is presented with options to "Rebook Lesson" or "Cancel Lesson".
- If "Rebook Lesson" is selected:
  - Instructor chooses a new date, time, and lesson type.
  - System validates instructor availability (no overlaps).
  - Instructor confirms new slot.
  - System sends notifications to student and manager about the rebooking.
- If "Cancel Lesson" is selected:
  - Instructor confirms cancellation.
  - System sends notifications to student and manager about the cancellation.

**8. Daily Overview**

- Instructor views "Today's Schedule" directly on the Instructor Dashboard.
- "Today's Schedule" displays a list of all lessons for the current day.
  - Each lesson entry includes: time, student name, and location.
- Instructor can click on a lesson within "Today's Schedule" to view full details (as defined in Calendar View).
- Instructor can see weather alert indicators for the day (e.g., “High wind warning”) (Optional Future Feature).
- Instructor has the option to print or export the daily summary (Optional Future Feature).

---

### 3. Manager User Story Map (MVP)

**Backbone:**

1.  Discover & Sign Up
2.  Kite School Settings
3.  Manager Dashboard
4.  Calendar Overview
5.  Manage Bookings
6.  Handle Rebooking Workflow
7.  Instructor Coordination
8.  View Customers
9.  Communication
10. AI Functionality (Nice-to-Have)

**Detailed Steps:**

**1. Discover & Sign Up**

- Manager navigates to KiteOps homepage.
- Manager clicks "Login / Register".
- New Manager clicks "Create Manager Account".
- New Manager enters name, email, password.
- New Manager receives verification email and confirms.
- Returning Manager logs in using email and password.

**2. Kite School Settings**

- First-time Manager enters organization details:
  - School name, contact info, and primary location.
  - Instructor roles and permission settings.
- Manager configures weather parameters for scheduling logic:
  - Minimum wind speed.
  - Maximum wind speed.
  - Preferred wind directions.
  - Allow precipitation (Yes/No).
  - Latitude and Longitude for the school's primary location.
- Manager can add/modify lesson types:
  - Define new lesson types (e.g., name, description).
  - For each lesson type, specify default duration and pricing.
  - Edit existing lesson types.
  - Deactivate lesson types.
- Manager can upload Kite School logo:
  - The uploaded logo will be displayed on the KiteOps login page and all dashboards for that school.
- Manager saves configuration.
- The Kite School Settings page displays the current saved information.
- A "Go to Dashboard" button is available (e.g., in the top navigation or as a prominent action).

**3. Manager Dashboard**

- Manager accesses the Manager Dashboard after login or navigating from Kite School Settings.
- The school's uploaded logo is displayed at the top.
- Dashboard displays:
  - Operational Overview Card (summary of today’s lessons only).
  - Instructor Availability Summary.
  - Pending Bookings / Rebooking Alerts.
  - Weather for today (shown graphically with emojis and numbers, e.g., ☀️ 15°C, 💨 15-20 knots NE).
- Buttons available:
  - "Add Booking"
  - "Assign Instructor"
  - "View Calendar"
  - "View Customers"
  - "Manage Instructors"
  - "Weather & Wind Summary for the week"
  - "View Reports" (Optional Future Feature, as per proposal)
  - "Send Message"
- Top navigation includes:
  - Profile icon (with dropdown for Name, Email, Role, Profile link, Logout).
  - Link/button to "Kite School Settings".

**4. Calendar Overview**

- Manager clicks "View Calendar" button on the Manager Dashboard.
- Manager views interactive calendar with switchable Week / Month views.
- Calendar includes filtering options:
  - Filter by Instructor: Select one or more instructors to view their schedules.
  - Filter by Lesson Type: Filter by Private, Group, Freestyle, etc.
- The calendar displays:
  - All booked lessons (color-coded by Instructor).
  - Instructor availability blocks.
  - Weather-based alerts and low-wind warnings.
  - In Month View, a day displays a summary (e.g., "X lessons booked", "Y instructors busy"). Clicking the day reveals the detailed schedule.
- A color-coded legend is displayed:
  - Blue = Confirmed lesson.
  - Orange = Pending confirmation.
  - Red = Weather risk.
- Manager can click on any slot for details.
  - A lesson pop-up or side panel displays:
    - Instructor, student, and lesson type.
    - Time, duration, and location.
    - Current weather forecast.
    - Lesson status (confirmed / pending / rebooked).
  - Quick actions available:
    - "Edit Lesson"
    - "Reassign Instructor"
    - "Cancel or Rebook"
    - "Message Student / Instructor"

**5. Manage Bookings**

- Manager clicks "Add Booking" button (from Dashboard or Calendar Overview).
- Manager is presented with options to:
  - **Add a booking for a New Student:**
    - Manager adds new Customer profile (name, contact, skill level).
    - Manager selects date, duration, and location.
    - Manager assigns Instructor (manual or auto-suggested by rule-based system).
    - System validates weather and Instructor schedule (availability, skill match, load balancing).
    - Manager clicks "Confirm Booking".
    - System sends notifications to all parties.
  - **Add a booking for an Existing Student:**
    - Manager selects existing Customer from database.
    - Manager selects date, duration, and location.
    - Manager assigns Instructor (manual or auto-suggested by rule-based system).
    - System validates weather and Instructor schedule (availability, skill match, load balancing).
    - Manager clicks "Confirm Booking".
    - System sends notifications to all parties.
  - **Add a Group Lesson:**
    - Manager adds multiple students under one session.
    - Manager selects date, duration, and location.
    - Manager assigns Instructor (manual or auto-suggested by rule-based system).
    - System validates weather and Instructor schedule (availability, skill match, load balancing).
    - Manager clicks "Confirm Booking".
    - System sends notifications to all parties.
- Manager can modify an existing booking (e.g., change time, date, student, instructor, lesson type).
  - System validates changes (weather, availability, skill match, overlaps).
  - System sends notifications for changes.

**6. Handle Rebooking Workflow**

- System automatically flags lessons impacted by bad weather.
- Manager is alerted to lessons requiring rebooking (e.g., via dashboard notification or specific section).
- Manager is presented with options:
  - **Option A: Review Rebooking Suggestions (manual approval):**
    - Manager clicks "View Rebooking Suggestions" (or similar action).
    - System proposes alternative time slots based on instructor and student availability, and weather forecasts, considering dynamic weighting for weather suitability based on booking horizon.
    - Manager reviews proposed rebooking options.
    - Manager approves and confirms rebooking.
  - **Option B: Initiate Automated Rebooking:**
    - Manager clicks "Automate Rebooking" (or similar action).
    - System attempts to automatically rebook each impacted lesson:
      - First, to the original instructor's next available and suitable slot.
      - If the original instructor is unavailable, then to another qualified instructor with an available and suitable slot.
    - System provides a summary of successful automated rebookings and any lessons that could not be automatically rebooked (requiring manual intervention).
- Notifications are automatically sent to the student and instructor about the rebooking (whether manual or automated).

**7. Instructor Coordination**

- Manager clicks "Manage Instructors" button on the Manager Dashboard.
- Manager views an Instructor Overview tab/page (e.g., a list of instructors).
- For each instructor listed, Manager can view:
  - Weekly schedule summary.
  - Total hours booked.
- Manager can click on an individual instructor to view their detailed calendar.
  - Within the individual instructor's calendar, availability gaps are visually highlighted on a mini-calendar/timeline.
- Manager can reassign lessons to instructors (as discussed in "Assign Instructor" functionality).
- Manager can block specific instructors for operational balance (e.g., temporary unavailability).
- Manager can send schedule updates or other notifications to individual instructors.

**8. View Customers**

- Manager clicks "View Customers" button on the Manager Dashboard.
- Manager views a list of all registered customers.
- Manager can search and filter the customer list (e.g., by name, skill level, contact info).
- Manager can click on an individual customer to view their profile.
  - Customer profile displays:
    - Name, contact info (email, phone).
    - Skill level, experience.
    - Country/Region, Language spoken.
    - History of booked lessons.
    - Any notes added by managers/instructors.
- Manager can add a new customer.
  - Manager enters customer details (name, contact info, skill level, etc.).
  - Manager saves new customer profile.
- Manager can edit an existing customer's profile.
  - Manager modifies customer details.
  - Manager saves changes.
- Manager can delete a customer.
  - Manager confirms deletion.
  - System handles associated data (e.g., past bookings).

**9. Communication**

- Manager clicks "Send Message" button on the Manager Dashboard.
- Manager is presented with options to:
  - **Send a Broadcast Message:**
    - Manager composes a general announcement (e.g., weather updates, school news).
    - Manager selects recipients (e.g., all instructors, all customers, all users, or customers booked on a specific date).
    - Manager sends message.
    - System sends message via email and/or in-app notification (one-way communication).
  - **Send a Direct Message:**
    - Manager selects an individual instructor or customer.
    - Manager composes a targeted message.
    - Manager sends message.
    - System sends message via email and/or in-app notification.
    - Recipients can reply to the email notification, and these replies will be directed to the manager's external email inbox.
- All messages are logged in a communication history.

**10. AI Functionality (Nice-to-Have)**

- This section is reserved for future enhancements related to AI functionality, such as AI-powered schedule optimization, personalized recommendations, or advanced analytics.
- No specific actions are defined for the MVP.
- [Note]: A separate brainstorming session will be conducted to detail AI functionality.
