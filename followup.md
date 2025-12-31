# Participant Communication Flow & State Machine

## Current Program Status (Synopsis)
**Completed (Stage 1 & Registration Refactor):**
- **Architecture Shift**: The system now centers on the `Registrations` table for signups. The `Participants` table is reserved specifically for Full-day companion app users.
- **Registration API**: `src/app/api/calendar/register/route.ts` successfully upserts to `Registrations`, generates secure `Confirm Tokens`, and triggers the Make.com webhook with a consistent payload.
- **Confirmation Endpoint**: `/confirm?token=...` is implemented and deployed. It:
    1.  Validates tokens against the `Registrations` table.
    2.  Sets `Status` to `Confirmed`.
    3.  **Conditional Access**: If the linked session is "Full-day", it automatically creates/updates a record in the `Participants` table with `Access Level: Modules 1–2`.
- **Build Quality**: Verified local production build and successful Cloud Run deployment.

**In Progress:**
- Moving to **Stage 2 (Welcome)** and **Stage 3 (Reminders)** using Airtable View Queues.

---

## 1. Data Model (Airtable)

### Table: Registrations (Primary Ledger)
*   **Status** (Single Select): `Pending` (Default), `Confirmed`, `Canceled`, `Declined`.
*   **Fields**: `Registrant Email`, `Registrant Name`, `Registrant Phone`, `Event ID`.
*   **Confirmation Fields**: `Confirm Token`, `Confirm URL`, `Confirmed At`, `Confirmed Via`.
*   **Checkpoints**: `Email: Ack Sent`, `Email: Welcome Sent`.
*   **Linked Fields**: `Session` (links to `Live Sessions`).

### Table: Participants (Companion App Access)
*   **Trigger**: Created/Updated upon Registration confirmation if Program Track is "Full-day".
*   **Fields**: `Email`, `Access Level` (`Modules 1–2`), `Status` (`Active`).

### Table: Live Sessions (Source of Truth)
*   **Fields**: `Google Event ID`, `Program Track` (`Free 90-min` vs `Full-day`), `Meeting Link`, `Description` (Agenda).

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