// ==============================================
// File: src/app/api/meta/oauth/start/route.ts
// Purpose: Redirect user to Facebook OAuth dialog
// ==============================================
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const scopes = searchParams.get("scopes") || [
    "pages_show_list",
    "pages_manage_metadata",
    "pages_read_engagement",
    "pages_messaging",
    "business_management",
  ].join(",");

  const appId = process.env.META_APP_ID;
  const redirect = process.env.META_REDIRECT_URI; // e.g. https://yourdomain.com/api/meta/oauth/callback

  if (!appId || !redirect) {
    return new Response(
      JSON.stringify({ error: "Server missing META_APP_ID or META_REDIRECT_URI" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  const state = Math.random().toString(36).slice(2);
  const auth = new URL("https://www.facebook.com/v19.0/dialog/oauth");
  auth.searchParams.set("client_id", appId);
  auth.searchParams.set("redirect_uri", redirect);
  auth.searchParams.set("scope", scopes);
  auth.searchParams.set("response_type", "code");
  auth.searchParams.set("state", state);

  return Response.redirect(auth.toString(), 302);
}
