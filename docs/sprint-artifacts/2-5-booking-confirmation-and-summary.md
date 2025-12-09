---
id: "2-5"
epic_id: "2"
title: "Booking Confirmation and Summary"
type: "frontend"
status: "drafted"
created_at: "2025-12-09"
---

# User Story
**As a** Guest Customer
**I want to** receive immediate visual confirmation and a summary of my booking details after payment/submission
**So that** I know my lesson is secured and I have a reference number for future communication.

# Acceptance Criteria

(Source: `docs/sprint-artifacts/tech-spec-epic-2.md` - Story 2.5 & `docs/fase-2-plan/ux-design-specification.md` - Section 3.4.1)

### 1. UI Confirmation (Modal)
- [ ] Upon successful booking submission, the Booking Modal content transitions to a "Success" state (or opens a distinct Success Modal).
- [ ] Displays a clear success message: "Booking Confirmed!".
- [ ] Displays the **Booking Reference Number** (e.g., "KO-2025-883") prominently.
- [ ] Includes a "Copy" button next to the reference number to copy it to the clipboard.

### 2. Booking Summary
- [ ] Displays a summary of the confirmed booking details:
    - **Lesson Type:** (e.g., "Private Beginner's Course")
    - **Date & Time:** Formatted clearly (e.g., "Saturday, Aug 24, 2025 @ 10:00 AM"). Timezone should be explicit or clearly implied as local to the school.
    - **Location:** (e.g., "Sandy Point Beach")
    - **Instructor:** First Name of the assigned instructor (e.g., "Alex").

### 3. Navigation & Feedback
- [ ] Displays a message indicating a confirmation email has been sent.
- [ ] Provides a "Close" button (and "X" icon) to dismiss the modal.
- [ ] Closing the modal returns the user to the Search Results page (or the state prior to opening the booking modal).

### 4. Component Usage
- [ ] Uses the `booking-confirmed-modal` design pattern from `docs/wireframes/customer-booking.html`.
- [ ] Reuses standard UI components (`Button`, `Card`, `Dialog`/`Modal`) from `shadcn/ui` library where possible.

# Tasks / Subtasks

- [ ] Task 1 (AC: #1, 4) - Implement Success View Component
    - [ ] Create `components/booking/BookingSuccess.tsx` (or similar) based on the wireframe.
    - [ ] Implement "Booking Confirmed" header and icon.
    - [ ] Implement Booking Reference display with "Copy to Clipboard" functionality.

- [ ] Task 2 (AC: #2) - Implement Summary Display
    - [ ] Accept booking details prop (Lesson, Date, Time, Location, Instructor).
    - [ ] Format Date and Time using `date-fns` (ensure consistency with `date-fns-tz` if needed for school time).
    - [ ] Handle missing instructor name gracefully (e.g., "Instructor Assigned Soon" if for some reason it's null, though 2.4 guarantees assignment).

- [ ] Task 3 (AC: #1, 3) - Integrate with Booking Flow
    - [ ] Update `components/booking/BookingModal.tsx` (or the parent container).
    - [ ] Add state management to switch from "Form" view to "Success" view upon successful API response from `create-booking`.
    - [ ] Pass the returned `booking_reference` and details from the API response to the Success component.

- [ ] Task 4 (AC: #3) - Navigation & Close
    - [ ] Implement `onClose` handler to reset the booking state and close the modal.
    - [ ] Verify user is returned to the correct context (Search Results).

- [ ] Task 5 - Tests
    - [ ] Unit Test: Verify `BookingSuccess` renders correct details from props.
    - [ ] Unit Test: Verify "Copy" button works (mock clipboard API).
    - [ ] E2E Test (Playwright): Complete a booking flow and verify the Confirmation Modal appears with a reference number.

# Dev Notes

### Learnings from Previous Story
**From Story 2.4 (Status: done)**
- **Booking Response:** The `create-booking` (or similar) API endpoint will return the `booking_reference` and `instructor_id` (or name). Ensure the frontend `BookingService` correctly parses this response to pass to the Success view.
- **Time Zone:** The backend uses `date-fns-tz` for school time. The frontend should ensure it displays the time consistent with the school's location, not necessarily the user's browser local time (though often they match for local customers, remote bookings differ).
- **Instructor Data:** The API might return an `instructor_id`. The frontend may need to have the instructor's name available (either returned in the booking response or looked up from the cached instructor list used in search). *Recommendation: API should return the assigned instructor's name to avoid extra lookups.*

[Source: stories/2-4-implement-intelligent-scheduling-engine.md#Dev-Agent-Record]

### Architecture patterns and constraints
- **Client Components:** This feature is primarily client-side React (UI).
- **State Management:** Use local state (React `useState`) or `TanStack Query` mutation state to handle the transition from "Submitting" to "Success".
- **Styling:** Tailwind CSS with `shadcn/ui` components.

### References
- **Wireframe:** `docs/wireframes/customer-booking.html` (See `booking-confirmed-modal` section).
- **Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-2.md`.
- **UX Spec:** `docs/fase-2-plan/ux-design-specification.md`.

### Project Structure Notes
- New Component: `app/components/booking/BookingSuccess.tsx` (suggested).
- Integration: `app/components/booking/BookingModal.tsx` (or where the form lives).

# Dev Agent Record

### Context Reference
<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used
Gemini-2.5-Flash

### Debug Log References

### Completion Notes List

### File List
