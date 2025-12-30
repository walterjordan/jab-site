import { Suspense } from 'react';
import Airtable from 'airtable';
import { redirect } from 'next/navigation';

// --- Configuration ---
// Note: We use the same env vars as the API route.
// Ensure AIRTABLE_API_KEY and AIRTABLE_BASE_ID are set in your environment.

const PARTICIPANTS_TABLE = process.env.AIRTABLE_PARTICIPANTS_TABLE || 'Participants';
const REGISTRATIONS_TABLE = process.env.AIRTABLE_REGISTRATIONS_TABLE || 'Registrations';

// Configure Airtable
const getAirtableBase = () => {
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    console.error("Missing Airtable configuration");
    return null;
  }
  return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
  );
};

// --- Confirmation Logic ---

async function confirmParticipant(token: string) {
  const base = getAirtableBase();
  if (!base) return { success: false, error: 'Server misconfiguration' };

  try {
    // 1. Find Registration by token
    const records = await base(REGISTRATIONS_TABLE)
      .select({
        filterByFormula: `{Confirm Token} = '${token}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) {
      return { success: false, error: 'Invalid or expired token.' };
    }

    const registration = records[0];
    const regId = registration.id;
    const currentStatus = registration.get('Status');
    const registrantEmail = registration.get('Registrant Email') as string;
    const registrantName = registration.get('Registrant Name') as string;
    const registrantPhone = registration.get('Registrant Phone') as string;
    
    // Get Program Track via Lookup (Array)
    const programTrackVal = registration.get('Program Track (from Session)');
    const programTrack = Array.isArray(programTrackVal) ? programTrackVal[0] : programTrackVal;

    // 2. Idempotent Update of Registration
    const updates: any = {};
    
    if (currentStatus !== 'Confirmed') {
        updates['Status'] = 'Confirmed';
    }

    if (!registration.get('Confirmed At')) {
      updates['Confirmed At'] = new Date().toISOString();
    }
    updates['Confirmed Via'] = 'Link';

    if (Object.keys(updates).length > 0) {
      await base(REGISTRATIONS_TABLE).update(regId, updates);
      console.log(`[Confirm] Updated Registration ${regId}:`, updates);
    }

    // 3. Logic: Create Participant Record if Full-day
    // "Participants" table is now ONLY for Companion App users (Full-day)
    if (programTrack === 'Full-day' || programTrack === 'Full access') {
       console.log(`[Confirm] Full-day track detected for ${registrantEmail}. Checking Participant record...`);
       
       const participantRecords = await base(PARTICIPANTS_TABLE)
         .select({
            filterByFormula: `{Email} = '${registrantEmail}'`,
            maxRecords: 1
         }).firstPage();
         
       const participantFields: any = {
           'Status': 'Active', // Or whatever "Active" status is for the app
           'Access Level': 'Modules 1–2',
           // Ensure basic fields are set if creating new
       };

       if (participantRecords.length > 0) {
           const pId = participantRecords[0].id;
           console.log(`[Confirm] Updating existing Participant ${pId}`);
           await base(PARTICIPANTS_TABLE).update(pId, participantFields);
       } else {
           console.log(`[Confirm] Creating new Participant for ${registrantEmail}`);
           // Add creation-only fields
           participantFields['Email'] = registrantEmail;
           participantFields['Full Name'] = registrantName;
           participantFields['Phone'] = registrantPhone;
           participantFields['Join Date'] = new Date().toISOString().split('T')[0];
           
           // Generate ID
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
            participantFields['Participant ID'] = `P-${timestamp}-${randomStr}`;

           await base(PARTICIPANTS_TABLE).create(participantFields);
       }
    }

    return { success: true };
  } catch (error: any) {
    console.error('[Confirm] Airtable Error:', error);
    return { success: false, error: 'Internal system error during confirmation.' };
  }
}

// --- UI Component ---

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const token = params.token;

  if (!token || typeof token !== 'string') {
     return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                    <h1 className="text-xl font-bold text-red-600 mb-2">Invalid Request</h1>
                    <p className="text-gray-600">No confirmation token provided.</p>
                </div>
            </div>
        </div>
     );
  }

  const result = await confirmParticipant(token);

  if (result.success) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                     <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                     </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">You're Confirmed!</h1>
                    <p className="text-gray-600 mb-6">
                        Thank you for confirming your registration. We have updated your status and will send you the session details shortly.
                    </p>
                    <a href="/" className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
      );
  } else {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Confirmation Failed</h1>
                    <p className="text-gray-600 mb-4">{result.error}</p>
                    <p className="text-sm text-gray-400">If this persists, please contact support.</p>
                </div>
            </div>
        </div>
      );
  }
}
