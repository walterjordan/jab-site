# Plan: Refactor Recap Page to Server Components

## Objective
Improve SEO and load performance by moving data fetching from the client-side (`useEffect`) to the server-side (`Server Components`). This removes the initial "Loading..." state for the user.

## Steps

1.  **Create `src/lib/drive.ts`**
    *   **Goal:** Extract the Google Drive API logic out of the Next.js API route (`src/app/api/drive/files/route.ts`) into a reusable function.
    *   **Why:** Server Components can call library functions directly. They cannot "fetch" their own internal API routes efficiently (and it's bad practice).
    *   **Functions:**
        *   `getDriveClient()`
        *   `getEventImages(eventId: string)` -> Returns `{ flyer, highlights, folderLink }`

2.  **Create `src/components/events/RecapView.tsx`**
    *   **Goal:** Isolate the *interactive* parts of the page (the image gallery, the lightbox, the state management).
    *   **Type:** `"use client"`
    *   **Props:**
        *   `flyer`: `DriveImage | null`
        *   `highlights`: `DriveImage[]`
        *   `folderLink`: `string | null`
    *   **Logic:**
        *   Renders the Grid.
        *   Handles `onClick` to open Lightbox.
        *   Handles `useState` for `selectedImage`.

3.  **Refactor `src/app/events/paint-sip-recap/page.tsx`**
    *   **Goal:** Become the "Data Fetching" container.
    *   **Type:** Server Component (default, no `"use client"`).
    *   **Logic:**
        *   Accept `searchParams` prop.
        *   Await `getEventImages(searchParams.eventId)`.
        *   Pass data to `<RecapView />`.
        *   **Fallback:** If no `eventId` or error, render a friendly "Event not found" state.

## Benefits
*   **Zero Layout Shift:** Content appears immediately.
*   **SEO:** Google bots see the text and images immediately.
*   **Simplicity:** Removes `useEffect`, `isLoading` states from the main page logic.
