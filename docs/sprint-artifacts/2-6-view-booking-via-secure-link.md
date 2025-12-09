# Story 2.6: View Booking Via Secure Link

Status: review

## Story

As a Guest,
I want to view my booking details via a secure, unique link,
so that I can easily access my lesson information without needing to log in.

## Acceptance Criteria

### Core Functional Requirements
1.  The system shall provide an endpoint `app/(auth)/booking/[token]` that renders specific booking details.
2.  The system shall validate the provided `token` to ensure secure access to only the corresponding booking.
3.  A secure, unique link to this endpoint shall be included in the booking confirmation email (initially mocked or logged if email service is not fully integrated).

### Additional Quality Criteria (Derived from NFRs)
4.  The booking details displayed shall be clear, concise, and responsive on various devices, adhering to UX design principles (Derived from NFR02 Usability).
5.  Access attempts with an invalid or expired token shall result in an appropriate error or redirection (Derived from NFR03 Security).

## Tasks / Subtasks

- [x] Implement the `app/(auth)/booking/[token]` page component (AC: #1)
  - [x] Fetch booking details using the provided token
  - [x] Display booking information (e.g., date, time, instructor, location, status)
- [x] Implement responsive styling and UX (AC: #4)
  - [x] Apply responsive styling as per UX Design Specification
  - [x] Verify layout on mobile, tablet, and desktop viewports
- [x] Implement token validation logic in a Supabase Edge Function or API route (AC: #2)
  - [x] Verify token authenticity and expiration
  - [x] Ensure token grants access only to the associated booking
- [x] Implement error handling for invalid access (AC: #5)
  - [x] Handle invalid/expired tokens gracefully (e.g., redirect to unauthorized page)
  - [x] Display appropriate error messages to the user
- [x] Integrate the secure link generation into the booking confirmation process (AC: #3)
  - [x] Generate a unique, time-limited token for each booking
  - [x] Construct the secure booking link
  - [x] Pass the link to the email/notification service (or log it for now)
- [x] Write unit and integration tests (AC: #2, #5)
  - [x] Test token generation and validation logic
  - [x] Test Edge Function/API route response for valid and invalid tokens
- [x] Write E2E tests for the secure link flow (AC: #1, #2, #3, #4, #5)
  - [x] Verify the full flow: Booking -> Link Generation -> Access Page
  - [x] Verify access with invalid token is blocked

## Dev Notes

### Learnings from Previous Story
**From Story 2.5 (Status: done)**
- **New Files Created:** `app/components/booking/BookingSuccess.tsx`, `app/components/BookingForm.tsx` (updated), `app/__tests__/components/BookingSuccess.test.tsx`, `tests/e2e/guest-booking.spec.ts`.
- **Completion Notes:** Implemented `BookingSuccess.tsx` with all required details and copy-to-clipboard functionality. Integrated into `BookingForm.tsx` to show success view after successful booking. Updated E2E test to verify confirmation modal content (Ref #, Instructor). Added unit tests for `BookingSuccess`.
- **Unresolved Review Items:**
  - [ ] [AI-Review][Low] Note: BookingSuccess.tsx uses a default value for Location ("Sandy Point Beach"). Ensure this is updated if multiple locations are introduced in the future. [Source: stories/2-5-booking-confirmation-and-summary.md]

- **Relevant architecture patterns and constraints:** The `app/(auth)` route group is specified for authentication-related pages. Supabase Auth with Row Level Security (RLS) should be utilized for securing access to booking data via the token. Edge Functions can be used for token validation and data retrieval logic to ensure security and performance. [Source: docs/fase-3-solution/architecture.md#10-security--performance]
- **Source tree components to touch:** `app/(auth)/booking/[token]/page.tsx`, `lib/booking-service.ts` (for token generation/validation), potentially a new Supabase Edge Function for secure data retrieval.
- **Testing standards summary:** Unit tests for token generation/validation logic. Integration tests for the Edge Function/API route. E2E tests for the full flow of booking, receiving the link, and accessing the details securely. Adherence to a comprehensive testing strategy is crucial, and formal documentation (e.g., `testing-strategy.md`) will be referenced here once established. [Source: docs/fase-3-solution/architecture.md#8-implementation-patterns--consistency-rules]

### Project Structure Notes

- The `app/(auth)/booking/[token]` structure aligns with the Next.js App Router conventions for dynamic routes within an authentication-related group. New components within this path should be focused on displaying booking details. Adherence to a unified project structure and coding standards is critical. Formal documentation for these standards will be referenced here once established.

### References

- FR015: Guests who have booked lessons shall be able to view their upcoming and past lessons via a secure link or booking reference. [Source: docs/fase-2-plan/PRD.md#FR015]
- UX Design Specification: General principles of responsive design, clarity, and efficiency apply to the display of booking details. [Source: docs/fase-2-plan/ux-design-specification.md#3-4-booking-process]
- Epic 2 Tech Spec (Story 2.6 Acceptance Criteria): Specifies the endpoint and token validation requirements. [Source: docs/sprint-artifacts/tech-spec-epic-2.md#story-2-6-secure-link]
- Architecture Document: Details on Next.js App Router, Supabase Auth, RLS, and Edge Functions for security and backend logic. [Source: docs/fase-3-solution/architecture.md#10-security--performance]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/2-6-view-booking-via-secure-link.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List
- Implemented `app/(auth)/booking/[token]/page.tsx` for viewing booking details.
- Created `supabase/functions/get-booking-by-token` edge function for secure validation and data retrieval.
- Updated `supabase/functions/create-booking` to generate `secure_token`.
- Created migration `supabase/migrations/20251209140000_add_secure_token.sql` adding `secure_token` and `secure_token_expires_at` to bookings table.
- Updated `BookingForm.tsx` and `BookingSuccess.tsx` to display "View Booking" link.
- Added E2E test `tests/e2e/secure-booking-link.spec.ts` covering full flow and invalid token scenario.
- Added unit tests for `booking-service.ts` to address review feedback.

### File List
- supabase/migrations/20251209140000_add_secure_token.sql
- supabase/functions/get-booking-by-token/index.ts
- supabase/functions/create-booking/index.ts
- app/app/(auth)/booking/[token]/page.tsx
- app/lib/booking-service.ts
- app/components/booking/BookingSuccess.tsx
- app/components/BookingForm.tsx
- tests/e2e/secure-booking-link.spec.ts
- app/__tests__/lib/booking-service.test.ts

## Change Log

- 2025-12-09: Story drafted by Bob (Scrum Master).
- 2025-12-09: Updated based on validation feedback: Added learnings from previous story, refined ACs and tasks, fixed citations.
- 2025-12-09: Implementation complete. Added secure token logic, backend functions, frontend page, and E2E tests. Status updated to review.
- 2025-12-09: Addressed review feedback: Added unit tests for `booking-service.ts`. Status updated to review.
- 2025-12-09: Story approved after re-review. All action items resolved.

---

## Senior Developer Review (AI) - Round 2

- **Reviewer**: Amelia
- **Date**: 2025-12-09
- **Outcome**: Approve

### Summary

The story was re-reviewed after the developer addressed the findings from the initial review. The previously missing unit tests for `lib/booking-service.ts` have been added and are passing. The implementation now satisfies all acceptance criteria and has sufficient test coverage.

### Key Findings

- All previous findings have been resolved.

### Action Items

- None.

---

## Senior Developer Review (AI) - Round 1

- **Reviewer**: Amelia
- **Date**: 2025-12-09
- **Outcome**: Changes Requested

### Summary

The implementation correctly satisfies all functional requirements for viewing a booking via a secure link. The token generation, validation, and error handling are implemented correctly, and the UI is responsive. E2E tests provide good coverage of the user flow. However, the lack of unit tests for the `booking-service.ts` file represents a testing gap that should be addressed.

### Key Findings

- **[Medium]** Missing unit tests for `lib/booking-service.ts`. While the E2E test covers the happy path and basic error states, unit tests are needed to properly isolate and test the `getBookingByToken` function's logic and error handling.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
| :-- | :--- | :--- | :--- |
| 1 | Endpoint `app/(auth)/booking/[token]` renders booking details. | IMPLEMENTED | `app/app/(auth)/booking/[token]/page.tsx` |
| 2 | Validate `token` for secure access. | IMPLEMENTED | `supabase/functions/get-booking-by-token/index.ts` |
| 3 | Secure, unique link included in booking confirmation. | IMPLEMENTED | `app/components/booking/BookingSuccess.tsx` |
| 4 | Booking details are clear, concise, and responsive. | IMPLEMENTED | `app/app/(auth)/booking/[token]/page.tsx` |
| 5 | Invalid or expired token results in an error. | IMPLEMENTED | `app/app/(auth)/booking/[token]/page.tsx`, `lib/booking-service.ts` |

**Summary: 5 of 5 acceptance criteria fully implemented.**

### Task Completion Validation

| Task | Marked As | Verified As |
| :--- | :--- | :--- |
| Implement the `app/(auth)/booking/[token]` page component | [x] | VERIFIED COMPLETE |
| Implement responsive styling and UX | [x] | VERIFIED COMPLETE |
| Implement token validation logic | [x] | VERIFIED COMPLETE |
| Implement error handling for invalid access | [x] | VERIFIED COMPLETE |
| Integrate the secure link generation | [x] | VERIFIED COMPLETE |
| Write unit and integration tests | [x] | **VERIFIED COMPLETE** |
| Write E2E tests for the secure link flow | [x] | VERIFIED COMPLETE |

**Summary: All tasks verified complete.** The task "Write unit and integration tests" is now considered fully verified.

### Action Items

**Code Changes Required:**
- [x] [Medium] Create a new test file `app/__tests__/lib/booking-service.test.ts`.
- [x] [Medium] Add unit tests for the `getBookingByToken` function in `booking-service.ts`, mocking the Supabase client to test success and error scenarios.
