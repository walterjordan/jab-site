# Plan: Social Sharing & Open Graph Metadata

## Objective
Ensure that when users share the recap link on social media (Facebook, LinkedIn, iMessage), a rich preview card with the Event Title and Flyer appears. Provide easy "Share" buttons on the page.

## Steps

1.  **Implement Dynamic Metadata (`page.tsx`)**
    *   **Function:** `export async function generateMetadata({ searchParams })`
    *   **Logic:**
        *   Fetch the event data (Flyer, Title) using `src/lib/drive.ts`.
        *   Return a `Metadata` object:
            *   `title`: "Recap: Paint & Sip - [Date]"
            *   `description`: "Check out the photos from our latest AI Mastermind networking event."
            *   `openGraph`:
                *   `images`: `[flyer.src]` (if available)

2.  **Create `src/components/ui/ShareButtons.tsx`**
    *   **Type:** `"use client"`
    *   **Logic:**
        *   Accept `url` and `title` as props.
        *   Render buttons for:
            *   **Facebook:** `https://www.facebook.com/sharer/sharer.php?u=[url]`
            *   **LinkedIn:** `https://www.linkedin.com/sharing/share-offsite/?url=[url]`
            *   **Copy Link:** Uses `navigator.clipboard.writeText(url)`. (Best for Instagram/texting).
    *   **UI:** Simple, icon-based row using existing styles.

3.  **Integrate into `RecapView.tsx`**
    *   Place the `<ShareButtons />` component near the "View Full Gallery" button or in the header.

## Notes on Instagram
*   Instagram **does not** allow direct link sharing via a web button (API restriction).
*   **Strategy:** Provide a "Copy Link" button and label it clearly ("Copy link to post on Story").
