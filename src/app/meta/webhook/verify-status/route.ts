// ============================================================================
// File: src/app/api/meta/webhook/route.ts
// Purpose: Receive and handle POST requests from Facebook’s Webhook system.
//          This is the endpoint that Facebook calls when new events occur
//          (messages, postbacks, opt‑ins, etc.) for subscribed Pages.
//
// Notes
// - Meta sends a POST request here with event payloads.
// - Must respond with 200 OK quickly (< 20s) or Meta will retry.
// - Validate requests (optionally) using X‑Hub‑Signature header.
// - Event payload structure:
//      {
//        "object": "page",
//        "entry": [
//          {
//            "id": "<PAGE_ID>",
//            "time": 1234567890,
//            "messaging": [ { sender, recipient, message, postback } ]
//          }
//        ]
//      }
// - You can log or forward events to your message‑handling pipeline here.
// ============================================================================
export const dynamic = "force-dynamic";

/**
 * POST /api/meta/webhook
 * Called by Meta when a subscribed webhook event occurs.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Meta may send multiple entries per webhook event
    if (body.object === "page" && Array.isArray(body.entry)) {
      for (const entry of body.entry) {
        const pageId = entry.id;
        const messagingEvents = entry.messaging || [];

        for (const event of messagingEvents) {
          const sender = event.sender?.id;
          const recipient = event.recipient?.id;
          const message = event.message;
          const postback = event.postback;

          // Log or forward the event — replace with your handler logic.
          console.log("Webhook Event:", {
            pageId,
            sender,
            recipient,
            message,
            postback,
          });
        }
      }
    }

    // Always return 200 to acknowledge receipt, even if body is empty.
    return new Response("EVENT_RECEIVED", { status: 200 });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Failed to process webhook event" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}

/**
 * GET /api/meta/webhook (Verification step)
 * Meta calls this once during setup to confirm your webhook URL.
 * Respond with the hub.challenge token if the verify_token matches.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  // Your verify token must match what you entered in your Meta App dashboard.
  if (mode === "subscribe" && token === process.env.META_VERIFY_TOKEN) {
    console.log("Webhook verified successfully.");
    return new Response(challenge || "", { status: 200 });
  }

  console.warn("Webhook verification failed.");
  return new Response("Forbidden", { status: 403 });
}
