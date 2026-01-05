# Participant Communication Flow & State Machine

## Current Program Status (Synopsis)
**Completed (Feature & Value Ladder Update):**
- **New Value Ladder**: Updated "Services" section to reflect:
    1.  **Same-Day Website ($100)**: Entry-level, high-speed execution.
    2.  **Digital Marketing ($499)**: Flyers, landing pages, social setup.
    3.  **Done-With-You Automation ($997+)**: Custom AI assistants and integration.
- **Event Recap System**: Fully automated "Past Events" section with auto-expiry, grouping, and a dynamic Google Drive gallery (`/events/paint-sip-recap`).
- **Interactive Demo**: "See How the System Thinks" component launched on the homepage to demonstrate automation logic visually.
- **Featured Layout**: Optimized "Upcoming Sessions" to show a single featured card for AI Masterminds with compact links for future dates.
- **Infrastructure**: Secured Google Drive API integration via Service Account for real-time asset fetching.

**In Progress:**
- Moving to **Stage 2 (Welcome)** and **Stage 3 (Reminders)** using Airtable View Queues.
- Finalizing the automated "Social Networking" track logic for Paint & Sip events.

---

## 1. Data Model (Airtable)

### Table: Live Sessions (Source of Truth)
*   **Fields**: `Google Event ID` (Unique ID), `Session Title`, `Program Track` (`Free 90-min` vs `Full-day` vs `Social Networking`), `Session Date`, `Start Time` (ISO), `End Time` (ISO), `Meeting Link`, `Description` (Agenda), `Cover Image` (Flyers).
*   **Sync Rule**: Logistical fields updated hourly from Calendar; Description/Title set only on initial creation.

---

## 2. Implementation Strategy (Hybrid)

### Stage 1: The "Instant" Acknowledgement (Live)
*   **Trigger**: Webhook from registration API.
*   **Action**: Make.com sends "Confirm Your Seat" email containing the `{{confirmUrl}}`.
*   **Update**: Sets `Registrations.Email: Ack Sent = true`.

### Stage 2: The "Confirmed" Welcome (Next Step)
*   **Goal**: Send detailed session info/access details after the user clicks confirm.
*   **Trigger**: Airtable View Queue `[QUEUE] Confirmed -> Needs Welcome`.
    *   *Filter*: `Status = "Confirmed"` AND `Email: Welcome Sent` is unchecked.
*   **Action Logic**:
    1.  Fetch session details (Meeting Link, Agenda) from `Live Sessions`.
    2.  Send "Welcome" email.
    3.  Set `Registrations.Email: Welcome Sent = true`.

### Stage 3: The Scheduled Reminders
*   **Goal**: Send timed reminders based on `Live Sessions.Session Date`.
*   **View Filters**: Logic based on `DATETIME_DIFF` between current time and session start.

---

## 3. Configuration & Secrets
*   **Base ID**: `appeJqZ5yjyPmh1MC`
*   **Registrations Table**: `tblF6gLxCuiNF7uni`
*   **Next.js Base URL**: `NEXT_PUBLIC_BASE_URL` (used for generating confirmation links).

---

## 4. Path Forward / Pending Tasks
- [ ] **Airtable**: Finalize `[QUEUE]` views for Welcome and Reminder stages.
- [ ] **Make.com**: Build Scenario for Stage 2 (Welcome Email) triggered by the `Confirmed` view.
- [ ] **Make.com**: Build Scenario for Stage 3 (Reminders) using scheduled polling of time-based views.
- [ ] **Validation**: Verify that `Participants` records created during confirmation correctly sync with `aimastermind.jordanborden.com`.
- [ ] **Analytics**: Monitor the performance of the new "$100 Same-Day Website" offer.
- [ ] **Content**: Consider adding video support to the Recap Gallery in the future.
- [ ] **Operational Manual**: Ensure the user knows how to use the `/scripts` directory for troubleshooting.

### Strategic Improvements (Backlog)
1.  **Monetize "$100 Website"**: Create a dedicated Airtable/Typeform intake form for the $100 offer to capture commitment immediately (Business Name, Colors, Logo) rather than sending to generic chat.
2.  **Demo Conversion**: Add a dynamic CTA inside the "System Thinks" demo (e.g., "Want this logic?") or a "Copy Prompt" feature to turn the toy into a lead magnet.
3.  **SEO Service Pages**: Break out `/services/websites` and `/services/automation` into dedicated pages to target specific keywords and run focused ads.
4.  **Technical Polish**: Refactor the Event Recap gallery to use `next/image` and potentially a caching layer for Google Drive images to improve LCP/FCP and mobile performance.
