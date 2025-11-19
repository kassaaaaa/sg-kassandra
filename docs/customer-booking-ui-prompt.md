### **AI Prompt for UI Mockup Generation: KiteOps Customer Booking Flow**

**Role:** You are a world-class UI/UX designer. Your task is to generate a set of high-fidelity, production-ready mockups for a web application.

**Project:** KiteOps - An intelligent booking platform for kite schools.

**Core Design Philosophy:**
*   **Design Direction:** "Minimalist Focus". The interface must be clean, modern, and unobtrusive, with generous whitespace. The user should be guided, not overwhelmed.
*   **Emotional Goal:** Users should feel the experience is **efficient and productive**.
*   **Platform:** Responsive Web Application. Please generate the desktop view first.

**Design System & Style Guide:**
*   **Component Library:** Base your designs on the structure and accessibility of **shadcn/ui**.
*   **Color Palette:**
    *   **Primary (Deep Navy):** `#0A2540` (Use for main CTAs, primary text, key elements).
    *   **Accent (Sky Blue):** `#4A90E2` (Use for secondary actions, selected states, highlights).
    *   **Background (Light Gray):** `#F5F5F5` (The main page background color).
    *   **Surface (White):** `#FFFFFF` (For cards, modals, and other elevated surfaces).
    *   **Text (Headings):** `#111111`.
    *   **Text (Body):** `#555555`.
    *   **Error:** `#dc3545`.
*   **Typography:**
    *   **Headings Font:** "Manrope" (Bold, clean, modern sans-serif).
    *   **Body Font:** "Inter" (Highly readable sans-serif).
    *   **Line Height:** Use 1.5 for body text.
*   **Layout & Spacing:**
    *   Use an **8px base unit** for all spacing (margins, padding).
    *   The main content area should have a maximum width of 1200px and be centered on the page.
    *   Employ a **flat design** with minimal shadows. Use subtle, thin borders for separation.

---

### **User Journey: Customer Guest Booking (Single-Page Modal Flow)**

Generate the following screens, which represent a single, continuous user flow on one page.

#### **Screen 1: Search & Results View**

This is the user's initial view. It contains the search interface at the top and the results list below it.

**1.1. Header:**
*   A simple header with the "KiteOps" logo on the left.
*   On the right, include "Login" and "Sign Up" as text links.

**1.2. Search Form Section:**
*   **Headline (Manrope font):** "Find Your Perfect Kitesurfing Lesson"
*   **Form Layout:** A single row of three input fields and a search button, all on a white surface (`#FFFFFF`) card with a subtle border.
    *   **Input 1: "Lesson Type"** (Dropdown with options: "Private Lesson", "Group Lesson", "Refresher Lesson").
    *   **Input 2: "Skill Level"** (Dropdown with options: "Beginner", "Intermediate", "Advanced").
    *   **Input 3: "Date"** (A date picker input, showing a calendar icon).
    *   **Button: "Search"** (Primary style: solid Deep Navy `#0A2540` background, white text).

**1.3. Search Results Section:**
*   This section appears directly below the search form.
*   **Sub-headline:** "Available Lessons for [Selected Date]"
*   Display a list of **Lesson Cards**.

**Lesson Card Component Design:**
*   **Container:** A white card (`#FFFFFF`) with rounded corners and a light border.
*   **Anatomy (Top to Bottom):**
    1.  **Lesson Name (Heading):** e.g., "Beginner Group Lesson" (Text: `#111111`).
    2.  **Instructor Name (Body):** e.g., "with John Doe" (Text: `#555555`).
    3.  **Price (Body, Bold):** e.g., "$150" (Text: `#0A2540`).
    4.  **Time Slots:** A horizontal list of interactive chips/buttons for available times (e.g., "10:00 AM", "12:00 PM", "02:00 PM").
        *   **Default State:** White background, navy text (`#0A2540`), navy border.
        *   **Hover State:** Light gray background (`#F5F5F5`).
        *   **Selected State:** When a user clicks a time slot, it should change to a solid Accent Blue (`#4A90E2`) background with white text. This indicates selection.
*   **Action:** When a time slot is selected, a **"Book Now" button** should appear at the bottom of the card. This button should be the primary style (solid Deep Navy `#0A2540`) background, white text.

---

#### **Screen 2: Booking Modal**

This modal appears as an overlay when the user clicks the "Book Now" button on a Lesson Card.

**2.1. Modal Container:**
*   A white (`#FFFFFF`) modal with rounded corners, centered on the screen.
*   Include a dark overlay (`rgba(0, 0, 0, 0.5)`) behind the modal.
*   An "X" icon in the top-right corner to close.

**2.2. Modal Header:**
*   **Title (Heading):** "Confirm Your Booking"
*   **Lesson Summary (Body):** Display the selected lesson details: "Beginner Group Lesson with John Doe on [Date] at [Selected Time]".

**2.3. Booking Form:**
*   Use a single-column layout for the form. Labels should be placed **above** their input fields.
*   **Input Fields (Required):**
    *   Full Name (Text input)
    *   Email Address (Text input)
    *   Age (Number input)
    *   Gender (Dropdown: "Male", "Female", "Non-binary", "Prefer not to say")
    *   Skill Level (Dropdown, pre-filled from search: "Beginner")
*   **Input Fields (Optional):**
    *   Experience Hours (Text input, with placeholder "e.g., 10 hours")
    *   Additional Notes (Text area, with placeholder "Anything we should know?")
*   **Confirmation Checkbox:** A checkbox with the label "I agree to the cancellation and reschedule policies."
*   **Submit Button:** A full-width primary button at the bottom of the modal.
    *   **Text:** "Confirm Booking"
    *   **Style:** Solid Deep Navy (`#0A2540`) background, white text.

---

#### **Screen 3: Success State (Inside the Modal)**

After the user clicks "Confirm Booking", the content of the modal changes to this success view.

**3.1. Modal Content:**
*   Remove the form.
*   Display a large success icon (e.g., a checkmark in a circle).
*   **Success Title (Heading):** "Booking Confirmed!"
*   **Success Message (Body):** "A confirmation email with all the details has been sent to your email address. We look forward to seeing you on the water!"
*   **Close Button:** A single, full-width secondary button.
    *   **Text:** "Close"
    *   **Style:** White background, navy text (`#0A2540`), navy border.