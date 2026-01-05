// src/lib/demo-logic.ts

export type Channel = "Instagram" | "Messenger" | "WhatsApp" | "TikTok";
export type Scenario = "New Lead" | "Comment on Post" | "Booking Request" | "Support Question" | "Follow-up";

export interface DemoOutput {
  incoming_message: string;
  auto_reply: string;
  decision: "answered_automatically" | "high_intent_lead" | "human_follow_up_required" | "needs_more_info";
  next_step: string;
  insights: {
    channel: Channel;
    scenario: Scenario;
    intent_level: "low" | "medium" | "high";
    data_to_capture: string[];
    log_destination: string;
  };
}

export function generateDemoResponse(channel: Channel, scenario: Scenario): DemoOutput {
  const base = {
    insights: {
      channel,
      scenario,
      intent_level: "medium" as const,
      data_to_capture: [] as string[],
      log_destination: "Airtable > Conversations",
    },
  };

  switch (scenario) {
    case "New Lead":
      return {
        incoming_message: "I need a website for my business.",
        auto_reply: "We can launch a Same-Day Website for a flat $100. Do you have your content (text/images) ready?",
        decision: "high_intent_lead",
        next_step: "qualify_content_readiness",
        insights: {
          ...base.insights,
          intent_level: "high",
          data_to_capture: ["service_type", "readiness_status"],
        },
      };

    case "Comment on Post":
      return {
        incoming_message: "Price? DM me.",
        auto_reply: "Sent you the details! Check your DMs for the full breakdown.",
        decision: "answered_automatically",
        next_step: "trigger_dm_handoff",
        insights: {
          ...base.insights,
          intent_level: "medium",
          data_to_capture: ["user_handle", "post_id"],
          log_destination: "Airtable > Social Leads",
        },
      };

    case "Booking Request":
      return {
        incoming_message: "Can I book a strategy call?",
        auto_reply: "Absolutely. Here is the link to our calendar: [Link]. Please select a time that works for you.",
        decision: "high_intent_lead",
        next_step: "send_booking_link",
        insights: {
          ...base.insights,
          intent_level: "high",
          data_to_capture: ["booking_intent", "preferred_time_window"],
        },
      };

    case "Support Question":
      return {
        incoming_message: "I can't find my login info.",
        auto_reply: "You can reset your password here: [Reset Link]. If that doesn't work, reply 'Human' and we'll jump in.",
        decision: "answered_automatically",
        next_step: "wait_for_resolution_confirmation",
        insights: {
          ...base.insights,
          intent_level: "low",
          data_to_capture: ["issue_category", "resolution_status"],
          log_destination: "Airtable > Support Tickets",
        },
      };

    case "Follow-up":
      return {
        incoming_message: "Thanks, that helped!",
        auto_reply: "Glad to hear it! On a scale of 1-5, how was your experience?",
        decision: "needs_more_info",
        next_step: "request_feedback_score",
        insights: {
          ...base.insights,
          intent_level: "medium",
          data_to_capture: ["sentiment_score", "feedback_text"],
        },
      };

    default:
      return {
        incoming_message: "Hello",
        auto_reply: "Hi there! How can we help you today?",
        decision: "needs_more_info",
        next_step: "menu_options",
        insights: { ...base.insights, intent_level: "low", data_to_capture: [] },
      };
  }
}
