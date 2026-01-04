## Event Photo Repository
**Root Google Drive Folder:** [Event Photos](https://drive.google.com/drive/folders/1Zmlqxwn2wLek1-0V36FHJTjzghEYv-Wr)

This folder contains subfolders for each event, named by their Airtable Event ID.

### Past Event Galleries
*   **Paint & Sip (Jan 2026):** [Public Gallery](https://drive.google.com/drive/folders/13IWLZXq6ezK9ZkIdnKeCaa46EdPmipMz?usp=sharing)

### Post-Event Checklist
At the conclusion of an event, the following variables/locations should be updated:
1.  **Google Drive:** Ensure a `public` folder exists within the event folder and is set to "Anyone with the link can view".
2.  **events.md:** Add the public gallery link to the list above.
3.  **Recap Page:** Update the `href` in the "View Full Gallery" button on the recap page (or `page.tsx` if using a dynamic component) to point to the new public folder.