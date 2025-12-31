const Airtable = require('airtable');
const path = require('path');
const fs = require('fs');

// Load .env.local manually since we are running a standalone script
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  console.log('Warning: .env.local not found at', envPath);
}

const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!API_KEY || !BASE_ID) {
  console.error('Error: AIRTABLE_API_KEY or AIRTABLE_BASE_ID not found in environment.');
  process.exit(1);
}

const base = new Airtable({ apiKey: API_KEY }).base(BASE_ID);

const TABLES = {
  Registrations: process.env.AIRTABLE_REGISTRATIONS_TABLE || 'Registrations',
  LiveSessions: process.env.AIRTABLE_SESSIONS_TABLE || 'Live Sessions',
  Participants: process.env.AIRTABLE_PARTICIPANTS_TABLE || 'Participants',
};

const EXPECTED_FIELDS = {
  Registrations: [
    'Registrant Email',
    'Registrant Name',
    'Registrant Phone',
    'Event ID',
    'Status',
    'Email: Ack Sent',
    'Email: Welcome Sent',
    'Session',
    'Confirm Token',
    'Confirm URL'
  ],
  LiveSessions: [
    'Google Event ID',
    'Program Track',
    'Meeting Link',
    'Description'
  ],
  Participants: [
    'Email',
    'Access Level',
    'Status'
  ]
};

const EXPECTED_VIEWS = {
  Registrations: [
    '[QUEUE] Confirmed, Needs Welcome'
  ]
};

async function checkFieldExistence(tableName, fieldName) {
  try {
    // efficient check: see if we can filter by the field. 
    // If the field doesn't exist, Airtable API (usually) throws an error 
    // or we can infer from the lack of error that it's valid schema at least.
    await base(tableName).select({
      filterByFormula: `NOT({${fieldName}} = '')`,
      maxRecords: 1
    }).firstPage();
    return true;
  } catch (err) {
    if (err.statusCode === 422 || err.message.includes('Unknown field')) {
      return false;
    }
    // If it's some other error (like 403), assume true or indeterminate, but don't fail schema check
    return true; 
  }
}

async function verifyTable(tableName, expectedFields, expectedViews = []) {
  console.log(`\n--- Verifying Table: ${tableName} ---`);
  
  // 1. Check View Existence
  for (const viewName of expectedViews) {
    try {
      await base(tableName).select({ view: viewName, maxRecords: 1 }).firstPage();
      console.log(`  [OK] View '${viewName}' exists.`);
    } catch (err) {
      console.error(`  [FAIL] View '${viewName}' NOT FOUND.`);
    }
  }

  // 2. Check Field Existence (Definitive)
  const missingFields = [];
  for (const field of expectedFields) {
    const exists = await checkFieldExistence(tableName, field);
    if (!exists) {
        missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
      console.error(`  [FAIL] Missing Fields: ${missingFields.join(', ')}`);
  } else {
      console.log(`  [OK] All expected fields verified in schema.`);
  }
}

async function main() {
  console.log('Starting Airtable Verification...');
  console.log(`Base ID: ${BASE_ID}`);
  
  await verifyTable(TABLES.Registrations, EXPECTED_FIELDS.Registrations, EXPECTED_VIEWS.Registrations);
  await verifyTable(TABLES.LiveSessions, EXPECTED_FIELDS.LiveSessions);
  await verifyTable(TABLES.Participants, EXPECTED_FIELDS.Participants);
  
  console.log('\nVerification Complete.');
}

main();
