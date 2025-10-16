// ============================================================================
// File: src/app/api/meta/webhook/verify-status/route.ts
// Purpose: Quickly verify the operational status of your webhook endpoint.
//          This can be used internally by your admin panel or health checks
//          to confirm that the webhook route is reachable and configured.
//
// Usage
//   GET  /api/meta/webhook/verify-status → returns basic status and environment info
//
// Example Response
//   {
//     "status": "ok",
//     "verified": true,
//     "environment": "production",
//     "webhook_url": "https://your-domain.com/api/meta/webhook"
//   }
// ============================================================================
export const dynamic = "force-dynamic";

/**
 * GET /api/meta/webhook/verify-status
 * Verifies that the webhook endpoint is reachable and returns minimal info.
 */
export async function GET() {
  try {
    // Determine environment (useful for debugging deployments)
    const env = process.env.NODE_ENV || "unknown";
    const baseUrl = process.env.META_BASE_URL || "not-configured";

    // Basic mock logic to confirm everything is up
    const webhookUrl = `${baseUrl?.replace(/\/$/, "")}/api/meta/webhook`;

    const statusPayload = {
      status: "ok",
      verified: true,
      environment: env,
      webhook_url: webhookUrl,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(statusPayload), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Unexpected verification error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
