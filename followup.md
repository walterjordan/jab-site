# Participant Communication Flow & State Machine

## Current Program Status (Synopsis)
**Completed (Stage 1):**
- **Next.js Integration**: The registration API (`src/app/api/calendar/register/route.ts`) creates a new participant record and triggers the Make.com webhook.
- **Data Model**: The `Participants` table in Airtable includes all necessary Checkpoint fields (`Email: Ack Sent`, `Email: Welcome Sent`, etc.), initialized to `false`.
- **Make.com Scenario 1 (Ack)**: A scenario is live that:
    1.  Receives the Webhook.
    2.  Fetches the specific Participant Record (Source of Truth).
    3.  Sends a "Registration Received" email.
    4.  Updates the Airtable record, setting `Email: Ack Sent` to `True`.

**In Progress:**
- We are now moving to **Stage 2** and **Stage 3**, which transition from "Push" (Webhook) to "Pull" (Airtable View Queues) logic for robust state management.

---

## 1. Data Model (Airtable)

### Table: Participants
*   **Status** (Single Select): `Registered` (Default), `Confirmed`, `Waitlist`, `Cancelled`.
*   **Checkbox Checkpoints** (Used for Idempotency/Tracking):
    *   `Email: Ack Sent`: Checked after Registration Acknowledgement email.
    *   `Email: Welcome Sent`: Checked after "Confirmed" Welcome email.
    *   `Email: 24h Reminder Sent`: Checked after 24-hour reminder.
    *   `Email: 1h Reminder Sent`: Checked after 1-hour "Starting Soon" email.
*   **Confirmation Fields**:
    *   `Confirm Token` (Single Line Text): Generated secure token.
    *   `Confirm URL` (URL): The full link sent to the user.
    *   `Confirmed At` (Date/Time): Timestamp of click.
    *   `Confirmed Via` (Single Select): `Link`, `Manual`, etc.

### Table: Sessions (Live Sessions)
*   **Fields to fetch for dynamic emails**:
    *   `Session Title`: Used in subject lines.
    *   `Description`: The primary agenda/content.
    *   `Session Date` & `Start Time`: To calculate reminder triggers.
    *   `Meeting Link`: URL for the session.

---

## 2. Implementation Strategy (Option C: Hybrid)

### Stage 2: The "Confirmed" Welcome (Make.com Scenario 2)
*   **Goal**: Send detailed session info ONLY when status is "Confirmed" (Manual or Auto).
*   **Trigger**: Airtable View Queue `[QUEUE] Needs Welcome Email`.
    *   *Filter*: `Status = "Confirmed"` AND `Email: Welcome Sent` is unchecked.
*   **Action Logic**:
    1.  **Watch Records**: Detects the new record in the view.
    2.  **Get Linked Record**: Fetch details (Agenda, Meeting Link) from the linked `Live Sessions` record.
    3.  **Email**: Send "Welcome to the Mastermind" email with session-specific details.
    4.  **Update Record**: Set `Email: Welcome Sent` = `True`. (Removes record from view).

### Stage 3: The Scheduled Reminders (Make.com Scenario 3)
*   **Goal**: Send timed reminders 24h and 1h before the event.
*   **Trigger**: Scheduled Polling (e.g., every 15-60 mins) of specific Airtable views.
*   **View 24h Queue Filter**: 
    `AND(Status="Confirmed", {Email: 24h Reminder Sent}=0, DATETIME_DIFF({Session Date}, NOW(), 'hours') <= 24, DATETIME_DIFF({Session Date}, NOW(), 'hours') > 0)`
*   **View 1h Queue Filter**: 
    `AND(Status="Confirmed", {Email: 1h Reminder Sent}=0, DATETIME_DIFF({Session Date}, NOW(), 'minutes') <= 60, DATETIME_DIFF({Session Date}, NOW(), 'minutes') > 0)`
*   **Action Logic**:
    1.  **Watch Records**: Detects participants in the time window.
    2.  **Email**: Send the respective reminder.
    3.  **Update Record**: Check the corresponding box (`Email: 24h Reminder Sent` or `Email: 1h Reminder Sent`).

---

## 3. Configuration & Secrets
*   **Airtable Base ID**: `appeJqZ5yjyPmh1MC`
*   **Participants Table**: `Participants` (tblb1l01AGfIZwWnC)
*   **Live Sessions Table**: `Live Sessions` (tbln5StU4nrOoRUfT)
*   **Webhook**: `MAKE_Mastermind_Registration_webhook_URL` (stored in `.env.local`).

---

## 4. Pending Tasks
- [ ] **Airtable**: Create View `[QUEUE] Needs Welcome Email`.
- [ ] **Airtable**: Create View `[QUEUE] 24h Reminder` (with Formula Filter).
- [ ] **Airtable**: Create View `[QUEUE] 1h Reminder` (with Formula Filter).
- [ ] **Make.com**: Build Scenario for Stage 2 (Welcome Email).
- [ ] **Make.com**: Build Scenario for Stage 3 (Reminders).

## 5. Endpoints
- **Confirmation Page**: `/confirm?token=...` (implemented). Sets Status to Confirmed.
