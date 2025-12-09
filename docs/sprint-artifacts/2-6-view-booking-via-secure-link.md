# Story 2.6: View Booking Via Secure Link

Status: drafted

## Story

As a Guest,
I want to view my booking details via a secure, unique link,
so that I can easily access my lesson information without needing to log in.

## Acceptance Criteria

1.  The system shall provide an endpoint `app/(auth)/booking/[token]` that renders specific booking details.
2.  The system shall validate the provided `token` to ensure secure access to only the corresponding booking.
3.  A secure, unique link to this endpoint shall be included in the booking confirmation email (initially mocked or logged if email service is not fully integrated).
4.  The booking details displayed shall be clear, concise, and responsive on various devices, adhering to UX design principles.
5.  Access attempts with an invalid or expired token shall result in an appropriate error or redirection.

## Tasks / Subtasks

- [ ] Implement the `app/(auth)/booking/[token]` page component (AC: #1, #4)
  - [ ] Fetch booking details using the provided token
  - [ ] Display booking information (e.g., date, time, instructor, location, status)
  - [ ] Apply responsive styling as per UX Design Specification
- [ ] Implement token validation logic in a Supabase Edge Function or API route (AC: #2, #5)
  - [ ] Verify token authenticity and expiration
  - [ ] Ensure token grants access only to the associated booking
  - [ ] Handle invalid/expired tokens gracefully (e.g., redirect to unauthorized page)
- [ ] Integrate the secure link generation into the booking confirmation process (AC: #3)
  - [ ] Generate a unique, time-limited token for each booking
  - [ ] Construct the secure booking link
  - [ ] Pass the link to the email/notification service (or log it for now)
- [ ] Write unit and integration tests for token generation and validation (AC: #2, #5)
- [ ] Write E2E tests for the secure link flow (AC: #1, #2, #3)

## Dev Notes

- **Relevant architecture patterns and constraints:** The `app/(auth)` route group is specified for authentication-related pages. Supabase Auth with Row Level Security (RLS) should be utilized for securing access to booking data via the token. Edge Functions can be used for token validation and data retrieval logic to ensure security and performance. [Source: docs/fase-3-solution/architecture.md#10-security--performance]
- **Source tree components to touch:** `app/(auth)/booking/[token]/page.tsx`, `lib/booking-service.ts` (for token generation/validation), potentially a new Supabase Edge Function for secure data retrieval.
- **Testing standards summary:** Unit tests for token generation/validation logic. Integration tests for the Edge Function/API route. E2E tests for the full flow of booking, receiving the link, and accessing the details securely. [Source: docs/fase-3-solution/architecture.md#8-implementation-patterns--consistency-rules]

### Project Structure Notes

- The `app/(auth)/booking/[token]` structure aligns with the Next.js App Router conventions for dynamic routes within an authentication-related group. New components within this path should be focused on displaying booking details.

### References

- FR015: Guests who have booked lessons shall be able to view their upcoming and past lessons via a secure link or booking reference. [Source: docs/fase-2-plan/PRD.md#FR015]
- UX Design Specification: General principles of responsive design, clarity, and efficiency apply to the display of booking details. [Source: docs/fase-2-plan/ux-design-specification.md]
- Epic 2 Tech Spec (Story 2.6 Acceptance Criteria): Specifies the endpoint and token validation requirements. [Source: docs/sprint-artifacts/tech-spec-epic-2.md#story-2-6-secure-link]
- Architecture Document: Details on Next.js App Router, Supabase Auth, RLS, and Edge Functions for security and backend logic. [Source: docs/fase-3-solution/architecture.md]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
