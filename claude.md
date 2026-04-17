# Claude Code Instructions for JAB-Site

## Tech Stack & Standards
- **Framework**: Next.js 15 (App Router). Prefer Server Components.
- **Core**: React 19 + TypeScript.
- **Styling**: Tailwind CSS v4.
- **Node Version**: `>=18 <=20`.

## Architecture & Deployments
- **Project ID**: `f2w-consulting` (199373649190).
- **Platform**: Google Cloud Run (Region: `us-east1`).
- **Build System**: Google Cloud Buildpacks. **Do not create or use a Dockerfile.**
- **Production**: Service `jab-site` (branch: `main`). Build via `cloudbuild.yaml`.
- **Development**: Service `jab-site-dev` (branch: `development`). Build via `cloudbuild-dev.yaml`.
- **Secrets**: Production/Dev secrets in GCP Secret Manager; local dev in `.env.local`.

## GCP Usage Safety Rule
- **Project Validation**: Before running any `gcloud` commands, **ALWAYS** validate that the active project is `f2w-consulting`. If it is not, switch it using `gcloud config set project f2w-consulting`.

## Core Integrations
- **Airtable**: Used as the primary database (API Key: `AIRTABLE_API_KEY`). Only use standard CRUD operations for records. Do not attempt schema changes.
- **Make.com**: Webhooks are used for immediate actions (Stage 1), and Airtable View Queues are used for delayed actions (Stage 2 & 3). Webhook URLs are in `.env.local`.
- **Google Calendar Sync**: Driven by `.github/workflows/sync-sessions.yml` and `scripts/sync-sessions.js`. Google Calendar is the source of truth for dates/times/links; Airtable is the source of truth for descriptions and images.

## Interaction Rules
- **Confirmation Required**: ALWAYS prompt for confirmation before performing any code changes or GitHub pushes.
