// ============================================================================
// File: src/app/api/meta/pages/route.ts
// Purpose: List Facebook Pages the user can manage. If a Business ID is
//          provided, we fetch pages owned by that Business. Otherwise we
//          fallback to personal pages via /me/accounts.
//
// Usage (client-side)
//   GET /api/meta/pages                   → all personal Pages the user manages
//   GET /api/meta/pages?businessId=12345  → Pages owned by a Business Manager
//
// Response
//   { pages: [ { id, name }, ... ] }
//
// Requirements
//   - Valid user access token (cookie set by OAuth callback)
//   - Permissions: pages_show_list (and business_management when using Business)
// ============================================================================
export const dynamic = "force-dynamic";

/**
 * GET /api/meta/pages[?businessId=...]
 * Returns: array of manageable pages for the authenticated user.
 */
export async function GET(req: Request) {
  try {
    // 1) Read user token from the cookie set during OAuth callback
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/(?:^|; )fb_user_token=([^;]+)/);
    const userToken = match ? decodeURIComponent(match[1]) : null;

    if (!userToken) {
      return new Response(
        JSON.stringify({ error: "No user access token found. Please login again." }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    // 2) Determine which Graph endpoint to call based on query param
    const urlObj = new URL(req.url);
    const businessId = urlObj.searchParams.get("businessId");

    let graphUrl: string;
    if (businessId) {
      // Business-owned pages (requires business_management permission)
      // Note: depending on setup you can use /{businessId}/owned_pages or /client_pages
      graphUrl = `https://graph.facebook.com/v19.0/${businessId}/owned_pages?access_token=${userToken}&limit=200`;
    } else {
      // Personal pages the user manages
      graphUrl = `https://graph.facebook.com/v19.0/me/accounts?access_token=${userToken}&limit=200`;
    }

    // 3) Call Graph API and normalize the result
    const res = await fetch(graphUrl);
    const data = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: data?.error || "Failed to fetch pages" }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    const pages = (data?.data || []).map((p: any) => ({ id: p.id, name: p.name }));

    return new Response(
      JSON.stringify({ pages }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Unexpected server error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
