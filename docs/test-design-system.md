# System-Level Test Design

**Author:** Murat (Master Test Architect)
**Date:** 2025-12-02
**Project:** ibe160
**Mode:** System-Level Testability Review (Phase 3)

---

## 1. Testability Assessment

This assessment evaluates the architecture's adherence to core testability principles: Controllability, Observability, and Reliability. The overall architecture is highly testable.

- **Controllability: PASS**
  - **Details:** The architecture provides excellent control over system state. Direct database access via Supabase allows for easy data seeding, while Supabase Edge Functions and Playwright's network mocking capabilities enable isolated testing of business logic and external dependencies (Weather API, Resend, Twilio).

- **Observability: PASS**
  - **Details:** The explicit architectural decision for "Structured, Centralized Logging," combined with Supabase's native monitoring, provides strong visibility into the system. The chosen stack and testing principles also promote deterministic test results, which are crucial for debugging.

- **Reliability: PASS**
  - **Details:** The decoupled nature of a Next.js frontend consuming Supabase backend services promotes test isolation. The principles outlined in the project's knowledge base for creating self-cleaning, parallel-safe tests provide a solid foundation for a reliable and efficient test suite.

---

## 2. Architecturally Significant Requirements (ASRs)

The following high-risk quality requirements have been identified. They represent the most critical areas for testing focus, scored by Probability (P) and Impact (I).

| ID | Architecturally Significant Requirement | P | I | Risk Score | Justification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ASR-4**| **Correctness (Intelligent Scheduling Engine)** | 3 | 3 | **9 (Critical)** | This is novel, complex logic central to the product's value. A bug could lead to double bookings or incorrect assignments, causing operational chaos. This is the highest-risk component. |
| **ASR-1** | **Performance (Sub-3s Load / 2s Actions)** | 2 | 3 | **6 (High)** | The scheduling engine's complex queries could easily degrade performance, impacting the core user experience and booking goals. |
| **ASR-2** | **Security (RBAC & Data Protection)** | 2 | 3 | **6 (High)** | Supabase Row Level Security is powerful but complex. A single misconfigured policy could lead to a data breach and GDPR non-compliance. |
| **ASR-3** | **Reliability (99.9% Uptime & Service Resilience)** | 2 | 3 | **6 (High)** | The system's dependency on multiple external services creates multiple points of failure. The weather API fallback is critical. |

---

## 3. Test Levels Strategy

This distribution focuses effort on the fastest, most reliable test levels to catch bugs early.

- **Unit: 60%**
  - **Rationale:** To rigorously validate the **Intelligent Scheduling Engine (ASR-4)**. Its high complexity and critical business impact demand extensive unit testing to cover all logical branches and edge cases. This provides the highest ROI for ensuring its correctness.

- **Integration: 30%**
  - **Rationale:** To validate data flow and security. This is critical for testing API contracts of Edge Functions and, most importantly, verifying the **Row Level Security policies (ASR-2)** for each user role to prevent data leakage.

- **E2E: 10%**
  - **Rationale:** To provide high-level confidence by validating only the "happy path" of critical user journeys (e.g., guest booking, instructor setting availability). This ensures the system is connected end-to-end without the high maintenance cost of a large E2E suite.

---

## 4. NFR Testing Approach

- **Correctness (ASR-4):**
  - **Primary:** An exhaustive suite of **Unit Tests** using `Vitest` to cover every rule, edge case, and scenario in the scheduling engine's logic.
  - **Secondary:** Focused **Integration Tests** to validate the engine's interaction with the database.

- **Security (ASR-2):**
  - **Primary:** **API Integration Tests** that attempt to violate RLS policies for each user role and assert that access is correctly denied (`403 Forbidden`).
  - **Secondary:** Automated **Vulnerability Scanning** (`npm audit`) in the CI pipeline.

- **Performance (ASR-1):**
  - **Primary:** Automated **Load Tests** using `k6` against the Staging environment, with explicit SLO thresholds that fail the build if breached.
  - **Secondary:** Frontend performance monitoring via **Vercel Analytics / Lighthouse**.

- **Reliability (ASR-3):**
  - **Primary:** **Integration Tests** using network mocking to simulate external service failures and verify fallback mechanisms.
  - **Secondary:** **E2E Tests** that mock API failures to ensure the UI handles errors gracefully without crashing. A monitored `/api/health` endpoint is also required.

- **Maintainability:**
  - **Primary:** Automated **CI jobs** to enforce test coverage (≥80%), low code duplication (<5%), and adherence to logging standards.

---

## 5. Test Environment Requirements

- **Local:** Supabase local development environment to enable developers to run all unit and integration tests.
- **CI/CD (Ephemeral):** Fresh, isolated environments per Pull Request to run the full automated test suite.
- **Staging (Production-like):** A persistent environment for `k6` load testing and final User Acceptance Testing (UAT).

---

## 6. Testability Concerns

These are manageable risks that require proactive attention.

| ID | Concern | Risk Level | Mitigation / Recommendation |
| :--- | :--- | :--- | :--- |
| **C-1** | **Observability Discipline** | Medium | **Enforce structured logging with correlation IDs from day one.** Without this, debugging issues across the Vercel/Supabase boundary will be extremely difficult. This should be a mandatory practice, checked by linting rules. |
| **C-2** | **Row Level Security (RLS) Debugging**| Medium | **Provide developers with training and tools for debugging RLS.** Faulty policies are a common source of hard-to-diagnose bugs. Early investment here will prevent significant delays. |
| **C-3** | **E2E Test Data Complexity** | Low | **Invest in a sophisticated test data factory early.** To properly test the scheduling engine E2E, we will need to create very specific database states, which requires a robust and flexible seeding mechanism. |

---

## 7. Recommendations for Sprint 0

The following actions should be prioritized to establish our testing foundation:

- **For the `*framework` workflow:**
  1.  Initialize the project with `Vitest` for unit/integration testing and `Playwright` for E2E tests.
  2.  Build the initial version of the test data factories, with a specific focus on creating the complex states needed to test the scheduling engine and RLS policies.

- **For the `*ci` workflow:**
  1.  Implement the CI pipeline to run tests on every PR, including jobs for `k6` performance tests, `npm audit`, and code coverage reporting.
  2.  Add a linting step to the CI pipeline to enforce the structured logging policy (e.g., checking for the presence of a logger with correlation ID).
