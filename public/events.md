## Event Photo Repository
**Root Google Drive Folder:** [Event Photos](https://drive.google.com/drive/folders/1Zmlqxwn2wLek1-0V36FHJTjzghEYv-Wr)

This folder contains subfolders for each event, named by their Airtable Event ID.
we 
### Past Event Galleries
*   **Paint & Sip (Jan 2026):** [Public Gallery](https://drive.google.com/drive/folders/13IWLZXq6ezK9ZkIdnKeCaa46EdPmipMz?usp=sharing)

### Global Event Rules & Logic

#### 1. Title Normalization (Grouping)
To keep the "Past Events" section clean, the system automatically groups multiple time slots or sessions of the same event into a single recap card.
*   **The Rule:** Any title containing "Slot X" or ": Slot X" (case-insensitive) will have that suffix removed for display and grouping. 
*   **Example:** "90 Minute AI Mastermind Workshop: Slot 1" and "90 Minute AI Mastermind Workshop: Slot 2" will both appear as "90 Minute AI Mastermind Workshop".
*   **Logic Location:** `src/components/booking/PastSessions.tsx` in the `normalizeTitle` function.

#### 2. Automatic Expiry
Events are moved from "Upcoming" to "Past" based on their `End Time` (falling back to `Start Time` if missing) in Airtable compared to the visitor's current time.
*   **Logic Location:** `src/app/api/calendar/sessions/route.ts`

### Post-Event Checklist
At the conclusion of an event, the following variables/locations should be updated:
1.  **Google Drive:** Ensure a `public` folder exists within the event folder and is set to "Anyone with the link can view".
2.  **events.md:** Add the public gallery link to the list above.
3.  **Recap Page:** Update the `href` in the "View Full Gallery" button on the recap page (or `page.tsx` if using a dynamic component) to point to the new public folder.