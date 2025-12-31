# Gemini Instructions

- Always prompt for confirmation before performing any code changes.
- Always prompt for confirmation before performing any GitHub pushes.

## Google Cloud Platform (GCP) Usage
- **Project Validation**: Before running any `run_gcloud_command` or other MCP actions that interact with GCP, **ALWAYS** validate that the active gcloud project is set to `f2w-consulting` (Project ID: `199373649190`).
- **Correction**: If the active project is incorrect, prompt the user to switch it using `gcloud config set project f2w-consulting`.

## Make.com Integration (Webhooks & Logic)
- **Primary Method**: Use Webhooks for immediate actions (Stage 1: Ack) and Airtable View Queues for state-based or delayed actions (Stage 2: Welcome, Stage 3: Reminders).
- **Architecture**: Follow the "Hybrid State Machine" pattern detailed in `followup.md`.
- **Configuration**: Webhook URLs are in `.env.local`.

## Airtable API Usage
- **Authentication**: Uses `AIRTABLE_API_KEY` (Personal Access Token).
- **Table Schema**:
    - `Registrations`: Primary ledger for event signups. Keyed by `Registrant Email` + `Event ID`.
    - `Participants`: ONLY for Full-day track attendees requiring companion app access (`aimastermind.jordanborden.com`).
    - `Live Sessions`: Source of truth for session-specific agenda/details and `Program Track` definition.
- **Workflow Logic**: 
    - Registration API upserts to `Registrations`.
    - Confirmation page (`/confirm`) updates `Registrations` and conditionally creates/updates `Participants` for 'Full-day' tracks.
- **Instruction**: Stick to Record operations (CRUD). For schema changes, instruct the user to do it manually in the UI.

## Tech Stack & Standards
- **Framework**: Next.js 15 (App Router). Prefer Server Components.
- **Core**: React 19 + TypeScript.
- **Styling**: Tailwind CSS v4.
- **Node Version**: Engines set to `>=18 <=20`.

## Deployment & Infrastructure
- **Platform**: Google Cloud Run (Service: `jab-site`, Region: `us-east1`).
- **Build System**: Google Cloud Buildpacks via `cloudbuild.yaml`. **No Dockerfile.**
- **Project ID**: `f2w-consulting` (199373649190).
- **Secrets**: Production secrets in GCP Secret Manager; local dev in `.env.local`.

## Configuration & Environment Variables
**Build-Time (Public):**
- `NEXT_PUBLIC_MESSENGER_URL`, `NEXT_PUBLIC_GA4`, `NEXT_PUBLIC_ADS_ID`, `NEXT_PUBLIC_BASE_URL`

**Runtime (Server-Side):**
- `AIRTABLE_BASE_ID`, `AIRTABLE_PARTICIPANTS_TABLE`, `AIRTABLE_REGISTRATIONS_TABLE`, `AIRTABLE_SESSIONS_TABLE`, `GOOGLE_CALENDAR_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `AIRTABLE_API_KEY`, `MAKE_Mastermind_Registration_webhook_URL`

## Integrations

### Google Calendar & Session Sync
- **Service Account**: Uses `googleapis` with a Service Account for authentication.
- **Automated Sync**: A GitHub Action (`.github/workflows/sync-sessions.yml`) runs hourly to synchronize Google Calendar events into the Airtable `Live Sessions` table.
- **Source of Truth**: 
    - **Google Calendar**: Exclusive source for `Session Date`, `Start Time`, `End Time`, and `Meeting Link`.
    - **Airtable**: Source for `Session ID` (manual), `Description` (manual/AI), and `Program Track` (derived from title).
- **Matching Logic**: Uses `Google Event ID` as the unique identifier to prevent duplicates.
- **Critical Config**: Requests must use `conferenceDataVersion: 1` to successfully retrieve Google Meet (`hangoutLink`) data.

## Automation & GitHub Actions
- **Workflow**: `.github/workflows/sync-sessions.yml`
- **Script**: `scripts/sync-sessions.js`
- **Secrets**: Requires `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `GOOGLE_CALENDAR_ID`, `GOOGLE_CLIENT_EMAIL`, and `GOOGLE_PRIVATE_KEY` to be configured in GitHub Repository Secrets.
- **Newline Handling**: `GOOGLE_PRIVATE_KEY` in GitHub Secrets must have literal `\n` characters preserved; the sync script includes robust parsing to handle CI/CD string mangling.

## Maintenance & Utility Scripts
The `scripts/` directory contains tools for operations and debugging:
- `verify-airtable-schema.js`: Validates that required tables, fields, and queue views exist in the live Airtable base.
- `sync-sessions.js`: The core logic for pulling Calendar events into Airtable.
- `inspect-sessions.js`: Dumps raw record data to the console for debugging record linkage and sync status.
- `debug-calendar-event.js`: Interrogates the Google Calendar API for a specific date range to verify field availability (e.g., Meet links).