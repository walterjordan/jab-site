# Operating Manual: Jab Site (`jab-site`)

**Last Updated:** January 12, 2026
**Version:** 1.0.0

## 1. Overview
`jab-site` is a Next.js web application serving as the primary digital presence for **Jordan & Borden (F2W Consulting)**. It functions as a marketing landing page, event registration portal, and resource hub.

**Core Capabilities:**
- **Event Registration:** Users can view and register for "AI Mastermind" and "Paint & Sip" events.
- **Dynamic Content:** Syncs session data from Google Calendar to Airtable, which then feeds the frontend.
- **Resource Vault:** A library of AI prompts (`/resources/prompt-vault`).
- **Recap System:** specific post-event pages (e.g., `/events/paint-sip-recap`) with dynamic Google Drive image galleries.
- **Integrations:** Deeply integrated with Airtable (CRM/CMS), Google Workspace (Calendar/Drive), and Make.com (Automation).

---

## 2. Architecture & Tech Stack

### Frameworks & Libraries
- **Frontend:** Next.js 15 (App Router), React 19.
- **Styling:** Tailwind CSS v4.
- **Language:** TypeScript.
- **State/Data:** Server Components for initial fetch, Client Components for interactivity.

### Directory Structure
```
src/
├── app/                  # Next.js App Router
│   ├── api/              # Backend API Routes
│   │   ├── calendar/     # Event registration & session listing
│   │   ├── drive/        # Google Drive file listing
│   │   └── meta/         # Facebook/Meta Webhooks & OAuth
│   ├── events/           # Dynamic Event Pages
│   └── resources/        # Resource Vault
├── components/           # React Components
│   ├── booking/          # Calendar & Registration UI
│   └── landing/          # Homepage Sections
├── lib/                  # Shared Utilities (CSV parsing, Demo logic)
└── scripts/              # Maintenance & Automation Node.js scripts
```

---

## 3. Deployment & Build Pipeline

The project is hosted on **Google Cloud Run** and built using **Google Cloud Build**.

### Environments
| Environment | Branch | Cloud Run Service | Build Config | URL |
| :--- | :--- | :--- | :--- | :--- |
| **Production** | `main` | `jab-site` | `cloudbuild.yaml` | `https://jordanborden.com` |
| **Development** | `development` | `jab-site-dev` | `cloudbuild-dev.yaml` | *(Auto-assigned)* |

### Build Process (Buildpacks)
The project **does not use a Dockerfile**. It uses Google Cloud Buildpacks to detect `package.json` and build the Node.js application automatically.

### Triggers
- **Push to `main`**: Triggers production deployment.
- **Push to `development`**: Triggers development deployment.

---

## 4. Configuration & Environment Variables

### Environment Variables (Cloud Run)
These are set in the Cloud Build config (`--set-env-vars`) or Secret Manager (`--set-secrets`).

| Variable | Type | Source | Purpose |
| :--- | :--- | :--- | :--- |
| `AIRTABLE_BASE_ID` | Runtime | Env Var | ID of the Airtable Base (`appeJqZ5yjyPmh1MC`). |
| `AIRTABLE_PARTICIPANTS_TABLE` | Runtime | Env Var | Table name for event participants. |
| `GOOGLE_CALENDAR_ID` | Runtime | Env Var | Source calendar ID. |
| `GOOGLE_CLIENT_EMAIL` | Runtime | Env Var | Service Account Email. |
| `AIRTABLE_API_KEY` | **Secret** | Secret Manager | Auth token for Airtable. |
| `GOOGLE_PRIVATE_KEY` | **Secret** | Secret Manager | Service Account Key (PEM format). |
| `MAKE_Mastermind_Registration_webhook_URL` | **Secret** | Secret Manager | Make.com webhook for registration logic. |

### Build-Time Variables
*Defined in `cloudbuild.yaml` substitutions, but currently hardcoded in source.*
- `NEXT_PUBLIC_GA4`: Google Analytics ID. (Currently hardcoded as `G-BL7JLYK2M9` in `src/components/GoogleAnalytics.tsx`).

---

## 5. Integrations & Data Flow

### 1. Event Sync (Google Calendar → Airtable)
- **Mechanism:** A GitHub Action (`.github/workflows/sync-sessions.yml`) runs hourly.
- **Script:** `scripts/sync-sessions.js`.
- **Logic:**
    1. Fetches events from Google Calendar.
    2. Matches them to Airtable records via `Google Event ID`.
    3. Updates Airtable with date/time changes.
    4. **Safety:** Only updates Titles/Descriptions on *creation*, preserving manual edits in Airtable.

### 2. Registration Flow
1. **User** clicks "Register" on `UpcomingSessions.tsx`.
2. **API Call:** `POST /api/calendar/register`.
3. **Backend:**
    - Checks availability.
    - Adds record to Airtable `Registrations` table.
    - Triggers Make.com Webhook (`MAKE_Mastermind_Registration_webhook_URL`).

### 3. Dynamic Galleries (Google Drive)
- **Page:** `/events/paint-sip-recap` (and others).
- **API:** `/api/drive/files`.
- **Logic:** Authenticates as Service Account, searches specific Folder ID for images, returns public URLs.
- **Convention:** Images must be in a subfolder named `public` or match specific naming patterns ("highlight").

### 4. Analytics (GA4)
- **Component:** `src/components/GoogleAnalytics.tsx`.
- **Implementation:** Client Component using `usePathname` and `useSearchParams`.
- **Events:** Automatically triggers `page_view` on route changes.
- **Measurement ID:** `G-BL7JLYK2M9`.

---

## 6. Maintenance & Scripts

The `scripts/` folder contains essential utilities for debugging and operations.

| Script | Purpose |
| :--- | :--- |
| `sync-sessions.js` | Core logic for Calendar ↔ Airtable sync. |
| `verify-airtable-schema.js` | Checks if Airtable tables/fields match code expectations. |
| `inspect-drive-folder.js` | Lists files in a Drive folder (debug permissions). |
| `create-paint-events.js` | Automates creating "Paint & Sip" events in Google Calendar. |
| `debug-calendar-event.js` | Raw dump of Google Calendar event data (check Meet links). |

**To Run:**
```bash
# Requires .env.local with secrets
node scripts/sync-sessions.js
```

---

## 7. Known Issues & Constraints

1.  **GA4 Hardcoding:** The Google Analytics ID is currently hardcoded in `src/components/GoogleAnalytics.tsx`. The Cloud Build environment variable `_NEXT_PUBLIC_GA4` is currently ignored.
2.  **Service Account Scope:** The Google Service Account (`199373649190-compute@...`) must be explicitly shared as a "Viewer" (or "Editor") on any Google Drive folder or Calendar it needs to access. It cannot "see" files just because they are public; it needs explicit permissions.
3.  **Airtable Rate Limits:** The sync script processes events serially to avoid hitting Airtable's 5 RPS limit.
4.  **Meta API:** The `src/app/api/meta` routes exist for Facebook Messenger automation but require valid access tokens and a configured App in the Meta Developer Portal.

---

## 8. Developer Quickstart

1.  **Clone:** `git clone ...`
2.  **Install:** `npm install`
3.  **Env:** Create `.env.local` with:
    ```env
    AIRTABLE_API_KEY=...
    AIRTABLE_BASE_ID=...
    GOOGLE_CLIENT_EMAIL=...
    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
    # ... other vars
    ```
4.  **Run:** `npm run dev`

---

## 9. Performance Analysis & Recommendations (Added Jan 12, 2026)

### Analysis Findings
A Lighthouse performance audit reveals a distinct profile: **Fast Server, Slow Assets.**

-   **Strengths:**
    -   **Server Response (TTFB):** Excellent. Google Cloud Run is delivering HTML efficiently.
    -   **JavaScript:** Not a bottleneck. Total Blocking Time (TBT) is low.
    -   **Stability:** Cumulative Layout Shift (CLS) is minimal.

-   **Critical Weakness (LCP):**
    -   **Largest Contentful Paint (LCP)** is extremely slow (often >5s).
    -   **Root Cause:** Oversized images hosted on Airtable (`airtableusercontent.com`) and Google Drive are being loaded at **full resolution** for above-the-fold content (e.g., Hero section, Feature Cards).
    -   **Wasted Bytes:** Multiple images (and the site logo) are significantly larger in pixel dimensions and file size (Megabytes) than their rendered size on screen (Kilobytes).

### Recommendations
Image delivery is the primary bottleneck. The following actions are recommended to dramatically improve load consistency:

1.  **Implement `next/image`:**
    -   Replace standard `<img>` tags with Next.js `<Image />` component.
    -   **Why:** This handles automatic resizing, lazy loading (for below-fold), and serving modern formats (WebP/AVIF).
    -   **Config:** Update `next.config.ts` to allow `airtableusercontent.com` and `drive.google.com` in `remotePatterns`.

2.  **Responsive Sizing:**
    -   Use the `sizes` prop on `<Image />` to ensure mobile devices download small variants, not the desktop-original 4K image.

3.  **LCP Priority:**
    -   Add the `priority` prop to the "Hero" image and the main Logo. This disables lazy-loading for these critical assets.

4.  **Network Hints:**
    -   Add `<link rel="preconnect">` tags for `https://v5.airtableusercontent.com` and `https://www.google-analytics.com` to speed up the initial connection handshake.

5.  **Thumbnails for Galleries:**
    -   For the Recap Gallery (`/events/paint-sip-recap`), ensure the API fetches or generates thumbnails rather than full-res backup photos, or use a proxy (like Cloudinary or Next.js Image Optimization) to resize them on the fly.
```