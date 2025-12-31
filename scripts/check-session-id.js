const Airtable = require('airtable');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

async function checkSessionId() {
    // Grab a synced record (which has no session ID currently)
    const records = await base('Live Sessions').select({
        filterByFormula: "NOT({Google Event ID} = '')",
        maxRecords: 1
    }).firstPage();

    if (records.length === 0) {
        console.log("No synced records found to test.");
        return;
    }

    const record = records[0];
    console.log(`Testing write to Session ID on record ${record.id}...`);

    try {
        await base('Live Sessions').update(record.id, {
            'Session ID': 999
        });
        console.log("Success: 'Session ID' is a writable Number field.");
        // Revert it
        await base('Live Sessions').update(record.id, { 'Session ID': null });
    } catch (err) {
        console.log(`Failed: 'Session ID' is likely read-only (Auto Number or Formula). Error: ${err.message}`);
    }
}

checkSessionId();