# JAB Site (Jordan & Borden Automation)

A Next.js platform for automation consulting, featuring automated session booking, integrated lead capture, and Meta connectivity tools.

## Key Features

- **Automated Mastermind Registration**: Seamless booking flow that syncs participants to **Airtable** and sends **Google Calendar** invites instantly.
- **Airtable Integration**: Real-time two-way sync (upsert) for participant tracking, including deduplication logic.
- **Google Calendar Automation**: Uses Domain-Wide Delegation to send professional calendar invites on behalf of the agency.
- **Meta Integration**: Tools for connecting Facebook Messenger and Instagram automation flows.

## Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Integrations**: 
    -   `googleapis` (Calendar API v3)
    -   `airtable` (Participant database)
-   **Deployment**: Google Cloud Run (via Cloud Build & Artifact Registry)

## Setup & Development

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables (`.env.local`):**
    Required for local development:
    ```bash
    # Google Calendar (Service Account)
    GOOGLE_CLIENT_EMAIL=...
    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY..."
    GOOGLE_CALENDAR_ID=...
    
    # Airtable
    AIRTABLE_API_KEY=...
    AIRTABLE_BASE_ID=...
    AIRTABLE_PARTICIPANTS_TABLE=Participants
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

## Deployment Pipeline

The project uses **Google Cloud Build** for continuous deployment:

1.  **Push to `main`**: Triggers the build.
2.  **Build**: Uses Google Cloud Buildpacks to create a container image.
3.  **Secrets**: Injects `AIRTABLE_API_KEY` and `GOOGLE_PRIVATE_KEY` from Google Secret Manager.
4.  **Deploy**: Deploys the service to **Cloud Run** (`us-east1`) with public access.
    *   *Note:* Ensure the Cloud Run Service Account has the **Secret Manager Secret Accessor** role.

## Project Structure

-   `src/app/api/calendar`: Backend routes for fetching sessions and handling registrations.
-   `src/components/booking`: UI components for the booking calendar and registration modal.
-   `cloudbuild.yaml`: CI/CD configuration.