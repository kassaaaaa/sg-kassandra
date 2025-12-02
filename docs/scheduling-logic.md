# KiteOps Intelligent Scheduling Engine

## Purpose

To automate and optimize the scheduling of kite surfing lessons by considering dynamic variables like weather, instructor availability, and school policies.  
The engine is fully time zone–aware and relies on fresh data to make its decisions.

---

## Critical Precept: School Time Zone Awareness

- All scheduling logic—date comparisons, daily load calculations, buffer logic, and availability checks—**must** be performed in the school’s explicitly configured time zone (stored in `school_settings`).
- Timestamps are only converted to UTC for final storage in the database or for API transmission.  
  This prevents subtle but critical bugs related to Daylight Saving Time and cross–time-zone calculations.

---

## Core Components (Inputs to the Engine)

- **Booking Request:** Lesson type, skill level, and requested time from the customer.
- **Weather Data:** Latest cached forecast from the `weather_data` table. The engine verifies the freshness of this data before using it.
- **School Settings:** Manager-defined operational rules from `school_settings`, including:
  - Minimum/maximum wind speeds
  - A configurable **Safety Buffer Window**
  - A **Cached Weather Freshness Threshold** (e.g., 45 minutes)
- **Instructor Availability:** All available time slots from the `availability` table.
- **Instructor Qualifications:** Mapping of instructors to lessons they can teach.
- **Instructor’s Current Load:**  
  Total count of `confirmed` and `pending` bookings assigned to an instructor for a given calendar day, calculated using the school’s **local time zone**.

---

## Implementation Guide / Data Flow

### **Flow 1: New Booking Request**

1. **Check Booking Horizon:** Ensure the requested booking date is within the next 7 days.
2. **Conditional Weather Check:**
   - **Within 7 days:** Fetch the latest weather data (respecting freshness threshold). If conditions are unsuitable, flag the time slot.
   - **More than 7 days away:** Skip the initial weather check.
3. **Find Qualified Instructors:** Identify all instructors qualified to teach the lesson.
4. **Filter by Availability:** Filter instructors available at the requested time (interpreted in the school’s time zone).
5. **Apply Load Balancing & Deterministic Tie-Breaker:**
   - Prioritize instructors by their **Current Load**.
   - **Tie-Breaker Rules:**
     1. Fewest daily bookings
     2. Earliest finishing lesson
     3. Alphabetical by name
6. **Assign & Confirm:** Assign the best-matched instructor and set the booking status to `confirmed`.

---

### **Flow 2: Automatic Wind Adaptation (Scheduled Task)**

1. **Scan Future Bookings:** Query upcoming `confirmed` bookings.
2. **Fetch Latest Weather (with Freshness Check):**
   - Check the `observed_at` timestamp of corresponding `weather_data`.
   - If older than the freshness threshold, fetch new data from OpenWeatherMap.
   - If fresh fetch fails, use cached data but flag the result with a **stale data** warning.
3. **Identify Conflicts (with Buffer Window):**
   - Check if any part of the lesson time slot, including the **Safety Buffer Window**, violates weather rules.
   - All time comparisons use the **school’s local time zone**.
   - If conflict: set status to `at_risk` and populate `status_reason`.
4. **Alert Manager:** Push a real-time update to the manager dashboard.
5. **Propose Solutions (Optional):** Suggest alternate lesson slots.
6. **Manager Action & Notification:** Manager decides and updates the booking accordingly.

---

## Associated Booking Status Lifecycle & Context

- A booking progresses through:  
  **pending → confirmed → at_risk → (rebooked | cancelled)**  
  It may also move to **completed**.
- The `status_reason` TEXT field on the `bookings` table provides clear human-readable explanations for status changes.
