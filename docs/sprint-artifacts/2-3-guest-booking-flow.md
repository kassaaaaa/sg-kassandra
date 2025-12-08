# Story 2.3: Guest Booking Flow

Status: drafted

## Requirements Context Summary

This story focuses on implementing the guest booking flow. A user who is not logged in should be able to select a lesson and provide their contact information (Name, Email, Phone) in a modal to finalize the booking. This process must include a mandatory acceptance of the school's policies. The core functionality is to allow a seamless booking experience for new customers without the friction of mandatory account creation upfront.

**Source Documents:**
- `docs/sprint-artifacts/tech-spec-epic-2.md`
- `docs/fase-2-plan/PRD.md`

## Story

As a **Customer**,
I want **to book a lesson as a guest by providing my contact details at the final step**,
so that **I can complete a booking without needing to create an account first**.

## Acceptance Criteria

(Source: `docs/sprint-artifacts/tech-spec-epic-2.md` - Story 2.3)

1.  **Modal Trigger:** The booking modal opens upon selecting a lesson time slot from the search results.
2.  **Input Fields:** The modal form collects the guest's **Full Name**, **Email**, and **Phone Number**.
3.  **Policy Acceptance:** A mandatory checkbox for "I accept the cancellation and rebooking policies" is present and must be checked to proceed.
4.  **Backend Submission:** On form submission, the collected data is sent to the backend `create-booking` endpoint.
5.  **Form Validation:** All fields are required, and the email format is validated.

## Tasks / Subtasks

- [ ] Task 1 (AC: #1, 2, 3, 5) - Frontend: Build Guest Booking Modal
  - [ ] Create `app/components/BookingForm.tsx` component.
  - [ ] Implement form fields for Name, Email, Phone, and the policy checkbox using `shadcn/ui`.
  - [ ] Use `react-hook-form` and `zod` for client-side validation.
- [ ] Task 2 (AC: #4) - Frontend: API Integration
  - [ ] Create `app/lib/booking-service.ts` to handle the API call.
  - [ ] Integrate the service with `BookingForm` to submit data to the `create-booking` Edge Function.
  - [ ] Handle success and error states from the API call.
- [ ] Task 3 (AC: #) - Backend: Create `create-booking` Edge Function
  - [ ] Create `supabase/functions/create-booking/index.ts`.
  - [ ] Implement logic to receive booking data.
  - [ ] Validate incoming data with Zod.
  - [ ] (Placeholder) Invoke the `scheduling-engine` (to be built in Story 2.4).
  - [ ] (Placeholder) Create records in `customer_details` and `bookings` tables.
- [ ] Task 4 (AC: #) - E2E Testing
  - [ ] Write a Playwright test to simulate the guest booking flow.
  - [ ] Verify the modal opens, validation works, and the form can be submitted.

## Dev Notes

- **Architecture:** The booking form will be a client component, managing its own state. The `create-booking` Edge Function will eventually contain the core business logic.
- **Security:** The `create-booking` endpoint will need to be protected by CAPTCHA (Story 2.8) and have rate limiting in a production environment.
- **Data Models:** This story will interact with the `bookings` and `customer_details` tables.

### Learnings from Previous Story

**From Story 2.2 (Status: done)**

- **Service Pattern**: The established pattern is to use Supabase Edge Functions for backend logic. `create-booking` should follow the structure of `get-available-lessons`.
- **New Files Created**: The previous story created `supabase/functions/get-available-lessons/index.ts` for backend logic and `app/components/LessonSearch.tsx` for the UI. This story should create a similar `create-booking` function and a `BookingForm` component.
- **Async State**: `TanStack Query` was used for fetching in the search UI. For this story, `react-hook-form` will manage form state, and a service module (`booking-service.ts`) will handle the submission promise.
- **RLS Policies**: The `availability` table required the Edge Function to use the `service_role` key for access. Assume the `bookings` and `customer_details` tables will also have RLS policies, so the `create-booking` function will need to run with the `service_role` to insert data.
- **Pending Review Items**: The review for story 2.2 noted that unit tests for slot calculation logic were missing and that rate limiting should be considered for the search endpoint. While not directly blocking this story, it highlights the need for robust testing and security considerations for all new endpoints.

[Source: docs/sprint-artifacts/2-2-lesson-search-and-filtering-ui.md#Dev-Agent-Record]

### References

- **Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-2.md`
- **PRD:** `docs/fase-2-plan/PRD.md`
- **UX Design:** `docs/fase-2-plan/ux-design-specification.md`

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-12-08: Story created by Bob (Scrum Master).
