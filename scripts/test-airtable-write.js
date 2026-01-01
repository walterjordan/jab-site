const Airtable = require('airtable');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

async function testWrite() {
    const recordId = 'recpNyrk2X2B5Hcsn'; // Jan 11 session
    const testLink = 'https://meet.google.com/test-' + Date.now();

    console.log(`Attempting to write test link to record ${recordId}...`);
    console.log(`Test Link: ${testLink}`);

    try {
        const result = await base('Live Sessions').update(recordId, {
            'Meeting Link': testLink
        });
        console.log('SUCCESS!');
        console.log('Airtable returned:', result.get('Meeting Link'));
    } catch (err) {
        console.error('FAILED to write to Meeting Link.');
        console.error('Error Status:', err.statusCode);
        console.error('Error Message:', err.message);
        
        if (err.statusCode === 422) {
            console.log('\nPossible causes for 422:');
            console.log('1. The field name "Meeting Link" is slightly different (e.g. trailing space).');
            console.log('2. The field type is incompatible with a URL string.');
            console.log('3. The field is a Formula or Lookup and cannot be written to.');
        }
    }
}

testWrite();
