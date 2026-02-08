const Airtable = require('airtable');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

async function inspectData() {
    console.log('Fetching Live Sessions records...\n');
    const records = await base('Live Sessions').select({
        maxRecords: 10,
        sort: [{ field: 'Session Date', direction: 'desc' }] // Newest first
    }).firstPage();

    records.forEach(r => {
        const isSynced = !!r.get('Google Event ID');
        const hasSessionId = !!r.get('Session ID');
        
        console.log(`[${isSynced ? 'SYNCED' : 'MANUAL'}] ${r.get('Session Title')}`);
        console.log(`  - ID: ${r.id}`);
        console.log(`  - Session ID (Auto #?): ${r.get('Session ID')}`);
        console.log(`  - Google Event ID: ${r.get('Google Event ID') || 'NULL'}`);
        console.log(`  - Drive Folder ID: ${r.get('Drive Folder ID') || 'NULL'}`);
        console.log(`  - Meeting Link: ${r.get('Meeting Link') || 'NULL'}`);
        console.log(`  - Description: ${r.get('Description') ? (r.get('Description').substring(0, 50) + '...') : 'NULL'}`);
        console.log(`  - AI Summary: ${r.get('Session Summary (AI)') ? 'Present' : 'NULL'}`);
        console.log('--------------------------------------------------');
    });
}

inspectData();
