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
- **Google Calendar**: Uses `googleapis` with Service Account.
- **Meta/Facebook**: OAuth/Webhook logic in `src/app/api/meta/...`.