# Gemini Instructions

- Always prompt for confirmation before performing any code changes.
- Always prompt for confirmation before performing any GitHub pushes.

## Google Cloud Platform (GCP) Usage
- **Project Validation**: Before running any `run_gcloud_command` or other MCP actions that interact with GCP, **ALWAYS** validate that the active gcloud project is set to `f2w-consulting` (Project ID: `199373649190`).
- **Correction**: If the active project is incorrect, prompt the user to switch it using `gcloud config set project f2w-consulting`.

## Event Recap System
- **Automatic Expiry**: The API (`/api/calendar/sessions`) automatically filters events into "Upcoming" or "Past" based on their End Time vs. Current Time. No manual status update is required.
- **Drive Integration**:
    - Uses a dedicated API route (`/api/drive/files`) to fetch images securely.
    - **Flyer Search**: Looks for a subfolder named `flyer` (or `flyers`) inside the event's folder.
    - **Highlight Search**: Looks for a subfolder named `public` and images containing "highlight" in the filename.
- **Service Account**: The Google Service Account (`199373649190-compute@developer.gserviceaccount.com`) **MUST** have Viewer access to the specific event folders in Drive for this system to work.

## Interactive Demo
- **Logic Location**: `src/lib/demo-logic.ts` contains the deterministic rules for the "See How the System Thinks" component.
- **UI Component**: `src/components/landing/DemoInteractive.tsx`.

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
- **Platform**: Google Cloud Run (Region: `us-east1`).
- **Production**: Service `jab-site` (branch: `main`). Build via `cloudbuild.yaml`.
- **Development**: Service `jab-site-dev` (branch: `development`). Build via `cloudbuild-dev.yaml`.
- **Build System**: Google Cloud Buildpacks. **No Dockerfile.**
- **Project ID**: `f2w-consulting` (199373649190).
- **Secrets**: Production/Dev secrets in GCP Secret Manager; local dev in `.env.local`.

## Frontend & Event Logic
- **Hero Section**: Displays a 2-column grid of session lists centered on the page (AI Masterminds and Paint & Sip).
- **Session Display**:
    - `UpcomingSessions.tsx`: Handles both standard list and "Featured Layout" (Single Card + Links) modes.
    - `PastSessions.tsx`: Auto-groups past events by normalized title (removing "Slot X") and links to the dynamic Recap page.
    - **Airtable Driven**: Fetches from `/api/calendar/sessions`.
    - **Flyer Mode**: If a session has a `Cover Image` in Airtable, it renders as a vertical card with the image (`aspect-[2/3]`, `object-contain`).

## Integrations

### Google Calendar & Session Sync
- **Service Account**: Uses `googleapis` with a Service Account for authentication.
- **Domain-Wide Delegation**: Impersonates `walterjordan@f2wconsulting.com` for write operations (e.g., creating events).
- **Automated Sync**: A GitHub Action (`.github/workflows/sync-sessions.yml`) runs hourly to synchronize Google Calendar events into Airtable.
- **Source of Truth**: 
    - **Google Calendar**: Exclusive source for `Session Date`, `Start Time`, `End Time`, and `Meeting Link`.
    - **Airtable**: Source for `Session ID` (manual), `Description` (manual/AI), `Cover Image` (manual), and `Program Track`.
- **Matching Logic**: Uses `Google Event ID` as the unique identifier.
- **Safety Logic**: The sync script **only** updates description/title on *initial creation* to protect manual edits made in Airtable.
- **Critical Config**: Requests must use `conferenceDataVersion: 1` to retrieve Google Meet links.

## Automation & GitHub Actions
- **Workflow**: `.github/workflows/sync-sessions.yml`
- **Script**: `scripts/sync-sessions.js`
- **Secrets**: Requires `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `GOOGLE_CALENDAR_ID`, `GOOGLE_CLIENT_EMAIL`, and `GOOGLE_PRIVATE_KEY` to be configured in GitHub Repository Secrets.
- **Newline Handling**: `GOOGLE_PRIVATE_KEY` in GitHub Secrets must have literal `\n` characters preserved; the sync script includes robust parsing to handle CI/CD string mangling.

## Maintenance & Utility Scripts
The `scripts/` directory contains tools for operations and debugging:
- `verify-airtable-schema.js`: Validates that required tables, fields, and queue views exist in Airtable.
- `sync-sessions.js`: Core logic for pulling Calendar events into Airtable.
- `inspect-sessions.js`: Dumps raw record data to the console for debugging linkage.
- `debug-calendar-event.js`: Interrogates Google Calendar API for specific date ranges (verifies Meet links).
- `create-paint-events.js`: Automation to create "Paint & Sip" events in Google Calendar via impersonation.
- `check-airtable-times.js`: Diagnostic script to verify Date/Time field formatting in Airtable.
- `test-airtable-write.js`: Force-writes data to specific Airtable fields to test permissions.
- `inspect-drive-folder.js`: (New) Diagnostic to list files in a Drive folder using the Service Account.
