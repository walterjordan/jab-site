// ============================================================================
// File: src/app/api/meta/session/route.ts
// Purpose: Return the short‑lived Facebook *user* access token that was stored
//          by the OAuth callback in an HttpOnly cookie. The front‑end wizard
//          uses this to optionally exchange for a long‑lived user token and to
//          list Businesses/Pages the user can manage.
//
// Security notes
// - The token is set as an HttpOnly cookie so client JS cannot directly read it.
//   However, this API route runs on the server and can safely echo the value
//   back to the client after any auth you require. For production, protect this
//   endpoint with your own session/auth checks.
// - If the cookie is missing or expired, the wizard should ask the user to
//   re‑authenticate via the OAuth start route.
// ============================================================================
export const dynamic = "force-dynamic"; // always evaluate per request

/**
 * GET /api/meta/session
 * Returns: { userAccessToken?: string } or a helpful message when absent.
 */
export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";

    // Minimal cookie parsing (use a real cookie lib in production)
    const match = cookieHeader.match(/(?:^|; )fb_user_token=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;

    if (!token) {
      return new Response(
        JSON.stringify({ userAccessToken: null, message: "No user token in session. Please login with Facebook." }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ userAccessToken: token }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Failed to read session" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
