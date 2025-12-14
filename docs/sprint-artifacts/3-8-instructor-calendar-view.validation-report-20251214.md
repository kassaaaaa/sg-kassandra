# Validation Report

**Document:** docs/sprint-artifacts/3-8-instructor-calendar-view.context.xml
**Checklist:** .bmad/bmm/workflows/4-implementation/story-context/checklist.md
**Date:** 2025-12-14

## Summary
- Overall: 10/10 passed (100%)
- Critical Issues: 0

## Section Results

### Story Fields
Pass Rate: 1/1 (100%)
[✓] Story fields (asA/iWant/soThat) captured
Evidence:
```xml
  <story>
    <asA>a Manager, I want to view a master calendar of all school activities.
As an Instructor, I want to view my personal schedule and manage my availability.</asA>
    <iWant>to efficiently manage my time and commitments from a single "Calendar" page.</iWant>
    <soThat></soThat>
```
(lines 10-14)

### Acceptance Criteria
Pass Rate: 1/1 (100%)
[✓] Acceptance criteria list matches story draft exactly (no invention)
Evidence: Matches the provided story content in `docs/sprint-artifacts/3-8-instructor-calendar-view.md`

### Tasks/Subtasks
Pass Rate: 1/1 (100%)
[✓] Tasks/subtasks captured as task list
Evidence: Matches the provided story content in `docs/sprint-artifacts/3-8-instructor-calendar-view.md`

### Relevant Docs
Pass Rate: 1/1 (100%)
[✓] Relevant docs (5-15) included with path and snippets
Evidence: 5 documents included.
```xml
    <docs>
      <doc>
        <path>docs/fase-2-plan/PRD.md</path>
        <title>IBE160 Product Requirements Document (PRD)</title>
        <section>Functional Requirements</section>
        <snippet>FR018: Instructors shall be able to view and manage their schedule on an interactive calendar with month, week, day, and agenda views.</snippet>
      </doc>
      <doc>
        <path>docs/fase-2-plan/ux-design-specification.md</path>
        <title>UX Design Specification</title>
        <section>5.2.2. Availability Calendar (Instructor)</section>
        <snippet>A two-part layout featuring a persistent left sidebar for navigation and user info, and a main content area for the calendar. The header contains calendar title, navigation controls (Today, next/prev week), view switcher (Month, Week, Day), and primary actions ("+ Add availability", "Block time").</snippet>
      </doc>
      <doc>
        <path>docs/sprint-artifacts/tech-spec-epic-3-2.md</path>
        <title>Epic 3: Manager and Instructor Dashboards</title>
        <section>4.1. Services &amp; Modules (Frontend)</section>
        <snippet>Instructor Calendar: Display the logged-in instructor's schedule (lessons and availability). Provide multiple views (month, week, day, agenda).</snippet>
      </doc>
      <doc>
        <path>docs/fase-3-solution/epics.md</path>
        <title>ibe160 - Epic Breakdown</title>
        <section>Story 3.8: Instructor Calendar View</section>
        <snippet>As an Instructor, I want to view my schedule on an interactive calendar, so that I can easily see my commitments.</snippet>
      </doc>
      <doc>
        <path>docs/wireframes/instructor-dashboard.html</path>
        <title>Instructor Mockup</title>
        <section>Calendar View</section>
        <snippet>HTML mockup of the instructor calendar view, showing the layout, controls, and event color-coding.</snippet>
      </doc>
    </docs>
```
(lines 46-88)

### Relevant Code References
Pass Rate: 1/1 (100%)
[✓] Relevant code references included with reason and line hints
Evidence: 5 code artifacts included.
```xml
    <code>
      <artifact>
        <path>app/app/(protected)/calendar/page.tsx</path>
        <kind>page</kind>
        <symbol>CalendarPage</symbol>
        <reason>Main page component for the calendar. Will need to be refactored to handle role-based rendering of ManagerCalendar or the new InstructorCalendar.</reason>
      </artifact>
      <artifact>
        <path>app/components/calendar/ManagerCalendar.tsx</path>
        <kind>component</kind>
        <symbol>ManagerCalendar</symbol>
        <reason>Existing component for the manager's master calendar view. Can be used as a reference for the new InstructorCalendar component.</reason>
      </artifact>
      <artifact>
        <path>app/lib/hooks/useUser.ts</path>
        <kind>hook</kind>
        <symbol>useUser</symbol>
        <reason>Provides the current user's session and profile information, which will be needed to determine the user's role.</reason>
      </artifact>
      <artifact>
        <path>app/lib/booking-service.ts</path>
        <kind>service</kind>
        <symbol>getBookingsForUser</symbol>
        <reason>Existing service for fetching bookings. A new function will be needed to fetch instructor-specific calendar data (lessons and availability).</reason>
      </artifact>
      <artifact>
        <path>app/components/calendar/AddAvailabilityDialog.tsx</path>
        <kind>component</kind>
        <symbol>AddAvailabilityDialog</symbol>
        <reason>Existing modal for adding availability, which needs to be triggered from the new instructor calendar view.</reason>
      </artifact>
    </code>
```
(lines 89-123)

### Interfaces/API Contracts
Pass Rate: 1/1 (100%)
[✓] Interfaces/API contracts extracted if applicable
Evidence: 1 interface included.
```xml
  <interfaces>
      <interface>
        <name>getInstructorCalendarData</name>
        <kind>function</kind>
        <signature>getInstructorCalendarData(userId: string, startDate: Date, endDate: Date): Promise&lt;CalendarEvent[]&gt;</signature>
        <path>app/lib/calendar-service.ts (new)</path>
      </interface>
  </interfaces>
```
(lines 135-141)

### Constraints
Pass Rate: 1/1 (100%)
[✓] Constraints include applicable dev rules and patterns
Evidence: 4 constraints included.
```xml
  <constraints>
    <constraint>The implementation should be based on a robust library like `@fullcalendar/react` as a foundation.</constraint>
    <constraint>Data fetching must be performed using TanStack Query for efficient state management and caching.</constraint>
    <constraint>All Supabase queries must be subject to RLS policies, ensuring instructors can only see their own data.</constraint>
    <constraint>All date and time operations must handle UTC storage and conversion to the school's local time zone.</constraint>
  </constraints>
```
(lines 127-133)

### Dependencies
Pass Rate: 1/1 (100%)
[✓] Dependencies detected from manifests and frameworks
Evidence: 5 dependencies included.
```xml
    <dependencies>
      <dependency>
        <name>@fullcalendar/react</name>
        <version>^6.1.10</version>
        <reason>Recommended library for building the interactive calendar view.</reason>
      </dependency>
      <dependency>
        <name>@tanstack/react-query</name>
        <version>^5.90.12</version>
        <reason>Used for all server-side data fetching and state management.</reason>
      </dependency>
      <dependency>
        <name>react-hook-form</name>
        <version>^7.68.0</version>
        <reason>Used for managing forms, particularly for adding availability and blocking time.</reason>
      </dependency>
      <dependency>
        <name>zod</name>
        <version>3.23.8</version>
        <reason>Used for schema validation with react-hook-form.</reason>
      </dependency>
      <dependency>
        <name>date-fns</name>
        <version>^4.1.0</version>
        <reason>Used for all date and time manipulations.</reason>
      </dependency>
    </dependencies>
```
(lines 124-126, 142-166)

### Testing Standards and Locations
Pass Rate: 1/1 (100%)
[✓] Testing standards and locations populated
Evidence:
```xml
  <tests>
    <standards>Unit tests should be written for hooks and data transformation logic. E2E tests should be written with Playwright to verify UI behavior and user flows.</standards>
    <locations>
      <location>app/lib/hooks/__tests__/</location>
      <location>tests/e2e/</location>
    </locations>
    <ideas>
      <idea for="AC#1, AC#2">Write an E2E test to verify that the correct calendar view (Manager or Instructor) is displayed based on the user's role.</idea>
      <idea for="AC#3">Write a unit test for the `useInstructorCalendar` hook to ensure it fetches and processes data correctly.</idea>
      <idea for="AC#5">Write a unit test for the event color-coding logic.</idea>
      <idea for="AC#7">Write an E2E test to simulate an instructor logging in, navigating to the calendar, and triggering the 'Add availability' and 'Block time' modals.</idea>
    </ideas>
  </tests>
```
(lines 167-180)

### XML Structure
Pass Rate: 1/1 (100%)
[✓] XML structure follows story-context template format
Evidence: The XML structure matches the template provided in `context-template.xml`.
