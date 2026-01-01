const Airtable = require('airtable');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

async function checkTimes() {
    console.log('Checking Start/End Times in Airtable...\n');
    const records = await base('Live Sessions').select({
        filterByFormula: "NOT({Google Event ID} = '')",
        maxRecords: 5
    }).firstPage();

    records.forEach(r => {
        console.log(`Record: ${r.get('Session Title')} (${r.id})`);
        console.log(`  - Session Date: ${r.get('Session Date')}`);
        console.log(`  - Start Time:   [${r.get('Start Time')}]`);
        console.log(`  - End Time:     [${r.get('End Time')}]`);
        console.log(`  - Raw Fields:   ${JSON.stringify(r.fields, null, 2)}`);
        console.log('--------------------------------------------------');
    });
}

checkTimes();
