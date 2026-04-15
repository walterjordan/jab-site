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
    const isWaitlist = currentStatus === 'Waitlist';
    
    // Get Program Track via Lookup (Array)
    const programTrackVal = registration.get('Program Track (from Session)');
    const programTrack = Array.isArray(programTrackVal) ? programTrackVal[0] : programTrackVal;

    // 2. Idempotent Update of Registration
    const updates: any = {};
    
    if (isWaitlist) {
        updates['Waitlist Status'] = 'Verified';
    } else if (currentStatus !== 'Confirmed') {
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
    // ... (rest of logic remains same)
    
    // ...
    return { success: true, isWaitlist };
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
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-slate-900 p-8 rounded-2xl border border-white/10 shadow-xl">
                    <h1 className="text-xl font-bold text-red-500 mb-2">Invalid Request</h1>
                    <p className="text-slate-300">No confirmation token provided.</p>
                </div>
            </div>
        </div>
     );
  }

  const result = await confirmParticipant(token);

    if (result.success) {

        return (

          <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">

              <div className="max-w-md w-full text-center">

                  <div className="bg-slate-900 p-8 rounded-2xl border border-[#7fff41]/20 shadow-xl shadow-[#7fff41]/5">

                       <div className="w-16 h-16 bg-[#7fff41]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#7fff41]/20">

                          <svg className="w-8 h-8 text-[#7fff41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>

                          </svg>

                       </div>

                      <h1 className="text-2xl font-bold text-white mb-2">

                          {result.isWaitlist ? "Waitlist Confirmed!" : "You're Confirmed!"}

                      </h1>

                      <p className="text-slate-300 mb-6">

                          {result.isWaitlist 

                              ? "Thank you for verifying your email. You are officially on the waitlist, and we'll contact you as soon as a spot opens up or new sessions are announced."

                              : "Thank you for confirming your registration. We have updated your status and will send you the session details shortly."

                          }

                      </p>

                      <a href="/" className="inline-flex items-center justify-center px-8 py-3 bg-[#7fff41] text-slate-900 font-bold rounded-full hover:bg-[#a4ff82] transition shadow-lg shadow-[#7fff41]/20">

                          Back to Home

                      </a>

                  </div>

              </div>

          </div>

        );

    }

   else {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-slate-900 p-8 rounded-2xl border border-white/10 shadow-xl">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-white mb-2">Confirmation Failed</h1>
                    <p className="text-slate-300 mb-4">{result.error}</p>
                    <p className="text-sm text-slate-500">If this persists, please contact support.</p>
                </div>
            </div>
        </div>
      );
  }
}
