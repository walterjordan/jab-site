const Airtable = require('airtable');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

async function checkPaintEvents() {
    console.log('Checking Paint & Sip events in Airtable...\n');
    const records = await base('Live Sessions').select({
        filterByFormula: 'SEARCH("Paint", {Session Title})',
        sort: [{ field: 'Session Date', direction: 'asc' }]
    }).firstPage();

    records.forEach(r => {
        console.log(`Title: ${r.get('Session Title')}`);
        console.log(`Date:  ${r.get('Session Date')}`);
        console.log(`Start: ${r.get('Start Time')}`);
        console.log(`Image: ${r.get('Cover Image') ? 'YES' : 'NO'}`);
        console.log('---');
    });
}

checkPaintEvents();
