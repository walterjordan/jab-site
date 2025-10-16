// ============================================================================
// File: src/app/api/meta/pages/token/route.ts
// Purpose: Obtain a **Page access token** for a selected Page using the
//          short‑lived user token (from cookie). The Page token is required for
//          operations like subscribing the app to webhooks and sending messages.
//
// Security model
// - Ideally, keep Page tokens **server‑side only**. If you must return it to
//   the browser (e.g., to call /pages/subscribe from the client), only use it
//   transiently and never store it in localStorage. Prefer proxying sensitive
//   actions through server routes instead.
//
// Flow
// 1) Front‑end posts { pageId } to this route.
// 2) This route reads the *user* token from cookie and calls Graph:
//      GET /{pageId}?fields=access_token,name
// 3) Responds with { pageAccessToken, pageName, pageTokenMasked }.
//
// Requirements
//   - Cookie set by OAuth callback: fb_user_token
//   - Permissions: pages_manage_metadata, pages_show_list
// ============================================================================
export const dynamic = "force-dynamic";

/**
 * POST /api/meta/pages/token
 * Body: { pageId: string }
 * Response: { pageAccessToken: string, pageName: string, pageTokenMasked: string }
 */
export async function POST(req: Request) {
  try {
    const { pageId } = await req.json();

    if (!pageId) {
      return new Response(
        JSON.stringify({ error: "Missing required pageId" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // Retrieve the short‑lived user token set by the OAuth callback route.
    const cookie = req.headers.get("cookie") || "";
    const m = cookie.match(/(?:^|; )fb_user_token=([^;]+)/);
    const userToken = m ? decodeURIComponent(m[1]) : null;

    if (!userToken) {
      return new Response(
        JSON.stringify({ error: "No user token found. Please re‑authenticate." }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    // Ask Graph API for the Page access token and name.
    const graphUrl = `https://graph.facebook.com/v19.0/${pageId}?fields=access_token,name&access_token=${userToken}`;
    const res = await fetch(graphUrl);
    const data = await res.json();

    if (!res.ok || !data?.access_token) {
      return new Response(
        JSON.stringify({ error: data?.error || "Failed to fetch Page token" }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    const pageAccessToken: string = data.access_token;
    const pageName: string = data.name || "";
    const pageTokenMasked = `${pageAccessToken.slice(0, 6)}••••${pageAccessToken.slice(-4)}`;

    // Return the token to the client. Consider removing `pageAccessToken` and
    // performing sensitive calls server‑side if you want stricter security.
    return new Response(
      JSON.stringify({ pageAccessToken, pageName, pageTokenMasked }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Unexpected server error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
