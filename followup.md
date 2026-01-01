# Participant Communication Flow & State Machine

## Current Program Status (Synopsis)
**Completed (Architectural Consolidation & Multi-Event Support):**
- **Architecture Shift**: The frontend is now fully **Airtable-driven**. The site queries Airtable `Live Sessions` as the primary source, allowing for rich content management (flyers, descriptions) without code changes.
- **Automated Sync**: Implemented a GitHub Action (`sync-sessions.yml`) that hourly synchronizes Google Calendar events (Source of Truth for Dates/Times/Links) into Airtable.
- **Safety Logic**: The sync script includes "Safety Logic" to protect manual edits in Airtable (like custom descriptions) while keeping logistical data (times/links) updated.
- **Multi-Event UI**: Refactored the Hero section to display side-by-side lists for "AI Mastermind" and "Paint & Sip" events.
- **Flyer Mode**: Implemented a dynamic "Flyer Mode" that renders sessions with `Cover Image` attachments as vertical, un-cropped cards (`object-contain`).
- **Dev Pipeline**: Set up a `development` branch with auto-deploy to a dedicated Cloud Run service (`jab-site-dev`) for safe testing of UI and logic changes.
- **Registration Refactor**: API successfully upserts to `Registrations` and triggers Make.com webhooks.

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
- [ ] **RSVP Sync**: (Optional) Implement the read-only Google Calendar RSVP status sync to Airtable.
- [ ] **Operational Manual**: Ensure the user knows how to use the `/scripts` directory for local diagnostics.