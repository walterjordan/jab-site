// ============================================================================
// File: src/app/api/meta/businesses/route.ts
// Purpose: Retrieve a list of Facebook Business assets that the user manages.
//          This is optional; if the user does not use Business Manager, you can
//          fallback to personal Pages instead.
//
// Flow
// - Called by the front‑end wizard after exchanging tokens.
// - Uses the user access token from cookie or request header.
// - Fetches businesses via Graph API: /me/businesses
// - Returns: { businesses: [ { id, name } ] }
//
// Env required
//   None beyond a valid user access token.
//
// Permissions required
//   - business_management
//   - pages_show_list
// ============================================================================
export const dynamic = "force-dynamic";

/**
 * GET /api/meta/businesses
 * Returns the list of businesses managed by the authenticated user.
 */
export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/(?:^|; )fb_user_token=([^;]+)/);
    const userToken = match ? decodeURIComponent(match[1]) : null;

    if (!userToken) {
      return new Response(
        JSON.stringify({ error: "No user access token found. Please login again." }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    // Facebook Graph API to fetch businesses the user can manage.
    const url = `https://graph.facebook.com/v19.0/me/businesses?access_token=${userToken}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: data?.error || "Failed to fetch businesses" }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    // Simplify data structure for client use.
    const businesses = (data?.data || []).map((b: any) => ({ id: b.id, name: b.name }));

    return new Response(
      JSON.stringify({ businesses }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Unexpected server error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
