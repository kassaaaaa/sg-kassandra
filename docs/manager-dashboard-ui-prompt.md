# AI Prompt: KiteOps Manager Dashboard UI Mockup

## 1. Overall Vision & Style

**Objective:** Generate a high-fidelity, responsive UI mockup for the **Manager Dashboard** of "KiteOps," a modern kite school booking platform.

**Design Direction:** The aesthetic must be **"Minimalist Focus"** — clean, professional, spacious, and highly organized. The interface should feel unobtrusive, allowing the manager to quickly assess operations and take action.

**Core Principles:**
- **Framework & Style:** The design must be based on the **shadcn/ui** component library, using its typical clean lines, flat surfaces, and subtle interactions.
- **Color Palette:** Adhere strictly to the "Professional & Trustworthy" theme:
    - **Primary (Actions):** Deep Navy (`#0A2540`)
    - **Accent (Highlights/Links):** Sky Blue (`#4A90E2`)
    - **Background:** Light Gray (`#F5F5F5`)
    - **Surface (Cards/Modals):** White (`#FFFFFF`)
    - **Text:** Grayscale (`#111111` for headings, `#555555` for body).
    - **Semantic Colors:** Use `#ffc107` for Warnings (like weather alerts) and `#28a745` for Success indicators.
- **Typography:**
    - **Headings:** "Manrope" (bold, clean sans-serif).
    - **Body Text:** "Inter" (highly readable sans-serif).
- **Spacing:** Use ample whitespace. All elements should feel like they have room to breathe, following an 8px base unit for margins and padding.

---

## 2. Page Layout & Structure

- **Main Layout:** A full-width page with a light gray (`#F5F5F5`) background.
- **Header:** A simple, clean header bar with a white background and a subtle bottom border.
    - **Left Side:** The Kite School's logo.
    - **Right Side:** A text link for "Kite School Settings" and a user profile **Avatar**. The avatar should be a circle. Clicking the avatar reveals a `shadcn/ui` **DropdownMenu** showing the manager's name, their role ("Manager"), and a "Logout" option.
- **Content Area:** Below the header, the main content should be a responsive grid of cards (`shadcn/ui Card` component). On a desktop view, this could be a 2 or 3-column grid.

---

## 3. Dashboard Components (Cards)

### Card 1: Weather Rebooking Alert (High Priority)
This is the most critical action item and should be visually prominent.
- **Component:** A `shadcn/ui Card` with a **yellow/orange (`#ffc107`) left border** to signify a warning.
- **Header:** An icon (like a warning triangle) and the title **"Resolution Center"**.
- **Content:**
    - A sub-heading: **"3 Lessons Need Review"**.
    - A brief, clear explanation: "Strong offshore winds are forecast for this afternoon. Review the affected lessons to notify customers and rebook."
- **Action:** A primary `shadcn/ui Button` with the Deep Navy (`#0A2540`) background. The button text should be **"Review Lessons"**.

### Card 2: Today's Snapshot
Provides a high-level summary of the day's key metrics.
- **Component:** A `shadcn/ui Card` with the title **"Today's Snapshot: November 17, 2025"**.
- **Content:** A horizontal, sectioned layout displaying three key stats. Each stat should have:
    - A large, bold number (using "Manrope" font).
    - A descriptive label below it (using "Inter" font).
    - A subtle icon next to it.
    - **Stat 1:** **"5"** with the label "Scheduled Lessons".
    - **Stat 2:** **"2"** with the label "Pending Bookings".
    - **Stat 3:** **"8"** with the label "Instructors Available".

### Card 3: Today's Weather
A simple, graphical weather summary.
- **Component:** A `shadcn/ui Card` with the title **"Local Conditions"**.
- **Content:** Display the weather graphically and horizontally.
    - A large sun emoji (☀️).
    - Followed by the text **"15°C"**.
    - A small gap, then a wind icon (💨).
    - Followed by the text **"15-20 knots NE"**.

### Card 4: Upcoming Lessons (Today)
A list of the day's lessons for quick reference.
- **Component:** A `shadcn/ui Card` with the title **"Upcoming Lessons"**.
- **Content:** Use a `shadcn/ui Table` component to list the lessons.
    - **Columns:** Time, Student, Instructor, Status.
    - **Rows:**
        - `10:00 AM` | `Alex Johnson` | `Maria Garcia` | `[Confirmed]`
        - `12:00 PM` | `Samantha Lee` | `David Chen` | `[Confirmed]`
        - `02:00 PM` | `Ben Carter` | `Maria Garcia` | `[Pending]`
    - **Styling:** The "Status" column should use `shadcn/ui Badge` components.
        - "Confirmed" should be a subtle blue badge.
        - "Pending" should be an orange/yellow badge.
        - "Weather Risk" (if applicable) should be a red badge.

### Card 5: Quick Actions
A centralized place for the manager's most common tasks.
- **Component:** A `shadcn/ui Card` with the title **"Quick Actions"**.
- **Content:** A grid or list of secondary-style `shadcn/ui Button` components (e.g., the "secondary" or "ghost" variant).
    - Button 1: **"Add Booking"**
    - Button 2: **"View Full Calendar"**
    - Button 3: **"Manage Instructors"**
    - Button 4: **"View Customers"**
    - Button 5: **"Send Message"**

---
**Final Check:** The overall composition should feel balanced, clean, and information-rich without being cluttered. The hierarchy should clearly draw the manager's eye first to the **Weather Alert**, then to the **Snapshot**, and finally to the other details.
