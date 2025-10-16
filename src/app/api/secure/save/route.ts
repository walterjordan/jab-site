// ============================================================================
// File: src/app/api/secure/save/route.ts
// Purpose: Securely store Facebook Page connection data in your backend or
//          database. Typically called after a Page is successfully linked via
//          the wizard.
//
// Data model (example)
//   {
//     pageId: string,
//     pageName: string,
//     pageTokenMasked: string,
//     businessId?: string,
//     connectedAt: string
//   }
//
// Notes
// - This example stores data in memory (for demonstration only).
// - Replace the mock logic with a call to your database (e.g. Firestore,
//   Supabase, PostgreSQL, MongoDB, etc.).
// - Never persist raw Page tokens in plaintext — always encrypt or hash them
//   if they must be stored.
// - This route can later be extended to associate saved Pages with user
//   accounts for multi-client dashboards.
// ============================================================================
export const dynamic = "force-dynamic";

// Temporary in-memory store for demonstration
const connections: any[] = [];

/**
 * POST /api/secure/save
 * Saves Page connection details securely.
 */
export async function POST(req: Request) {
  try {
    const { pageId, pageName, pageTokenMasked, businessId } = await req.json();

    if (!pageId || !pageName || !pageTokenMasked) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: pageId, pageName, or pageTokenMasked" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // Create a new record
    const record = {
      pageId,
      pageName,
      pageTokenMasked,
      businessId: businessId || null,
      connectedAt: new Date().toISOString(),
    };

    connections.push(record);

    return new Response(
      JSON.stringify({ success: true, record }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Failed to save data" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}

/**
 * GET /api/secure/save
 * Simple diagnostic endpoint to view saved connections (for development only).
 * Remove or secure this in production.
 */
export async function GET() {
  return new Response(JSON.stringify({ connections }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
