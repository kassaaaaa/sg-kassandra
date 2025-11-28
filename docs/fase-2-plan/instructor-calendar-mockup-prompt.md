### Prompt for AI Mockup Generation: Instructor Calendar View (v2)

**Objective:**
Create a high-fidelity, responsive UI mockup for the "Calendar" screen of a web application for kite school instructors. The design must be clean, professional, and minimalist, based on the provided design system and user flow specifications. The goal is to provide a clear, interactive interface for instructors to manage their schedule.

**1. Core Visual Style & Theme:**
*   **Design System:** Based on **shadcn/ui**, with a **Tailwind CSS** foundation. The calendar component itself should resemble a modern implementation like **React Big Calendar** or **FullCalendar**.
*   **Overall Aesthetic:** "Minimalist Focus." The interface must be clean and spacious. Prioritize clarity and ease of use.
*   **Color Palette:**
    *   **Primary Action:** Deep Navy (`#0A2540`)
    *   **Accent:** Sky Blue (`#4A90E2`)
    *   **Background:** Light Gray (`#F5F5F5`)
    *   **Surface (Cards/Modals):** White (`#FFFFFF`)
    *   **Text:** Dark Gray (`#111111` for headings, `#555555` for body).
    *   **Borders:** Subtle, light gray (`#E0E0E0`).
    *   **Calendar Event Colors:**
        *   **Available:** Green (`#28a745`) - Use a light green background with a darker green border.
        *   **Confirmed Lesson:** Blue (`#4A90E2`) - Solid blue background with white text.
        *   **Pending Booking:** Yellow (`#ffc107`) - Solid yellow background with dark text.
        *   **Unavailable/Blocked:** Gray (`#6c757d`) - Light gray background with diagonal lines.
*   **Typography:**
    *   **Headings:** "Manrope" (bold, clean sans-serif).
    *   **Body/UI Text:** "Inter" (highly readable sans-serif).

**2. Layout & Composition (Desktop View):**
*   **Navigation:** A persistent, vertical navigation sidebar on the left. The "Calendar" menu item is in an active state.
*   **Main Content Area:**
    *   **Header:** At the top, display the main title "My Calendar". To the far right, place two buttons:
        1.  A primary, solid navy (`#0A2540`) button: "**+ Add availability**".
        2.  A secondary, outlined button: "**Block time**".
    *   **Calendar Controls & Legend:** Below the header, create a control bar.
        *   **Left Side (Navigation):** Buttons for "**Today**", "**<**" (Back), and "**>**" (Next).
        *   **Center (Date Range):** The current view's date range (e.g., "November 10 – 16, 2025").
        *   **Right Side (View Toggles):** A segmented control to switch between "**Month**", "**Week**" (default), "**Day**", and "**Agenda**" views.
    *   **Color Legend:** Display a clear, non-intrusive legend somewhere visible, explaining the color codes (e.g., a small bar with colored dots and labels: Green - Available, Blue - Confirmed, Yellow - Pending, Gray - Unavailable).

**3. The Calendar Grid (Weekly View - Default):**
*   **Structure:** A 7-column grid (Mon-Sun) with an hourly time scale on the vertical axis (e.g., 8 AM to 8 PM).
*   **Events & Blocks:**
    *   **Confirmed Lessons (Blue):** Solid blocks displaying the lesson type (e.g., "Private - Beginner") and student name.
    *   **Pending Bookings (Yellow):** Solid blocks, clearly marked as "Pending".
    *   **Available Slots (Green):** Blocks with a light background and dashed border, labeled "Available".
    *   **Blocked Time (Gray):** Blocks with a shaded gray background and a subtle pattern (like diagonal lines).
*   **Agenda View:** When selected, this view should show a chronological list of only "Confirmed" and "Pending" lessons, grouped by day.

**4. Interaction 1: Clicking a Lesson (Confirmed or Pending):**
*   **Trigger:** Clicking on a blue or yellow lesson block.
*   **Result:** A pop-up modal appears with detailed information.
*   **Modal Content:**
    *   **Header:** Lesson Type (e.g., "Private Lesson - Intermediate").
    *   **Actions:** In the header or footer, include buttons for "**Rebook Lesson**" and "**Cancel Lesson**".
    *   **Section 1: Lesson Details**
        *   Date and Time
        *   Duration
        *   Location
    *   **Section 2: Student Details**
        *   Student Name
        *   Skill Level
        *   Age & Gender
        *   Experience (e.g., "5 hours prior")
        *   Language

**5. Interaction 2: Clicking an Availability or Blocked Slot:**
*   **Trigger:** Clicking on a green (Available) or gray (Blocked) block.
*   **Result:** A small, simple pop-up (or context menu) appears next to the clicked event.
*   **Pop-up Content:** Two options:
    *   An "**Edit**" button/link.
    *   A "**Remove**" button/link (with a trash can icon).

**6. Interaction 3: "Add Availability" / "Block Time" Modal:**
*   **Trigger:** Clicking the "+ Add availability" or "Block time" buttons in the header.
*   **Modal Design:** A clean, white modal appears, consistent with the rest of the design.
*   **Modal Content:**
    *   **Title:** "Add Availability" or "Block Time".
    *   **Form Fields:**
        *   Date(s) and time range selectors.
        *   Recurrence options (e.g., "Does not repeat", "Repeats weekly").
        *   A "Reason" text field (optional, for blocked time).
    *   **Validation:** The form should visually indicate that the system will check for scheduling overlaps.
    *   **Actions:** A primary "**Save**" button and a secondary "Cancel" link.