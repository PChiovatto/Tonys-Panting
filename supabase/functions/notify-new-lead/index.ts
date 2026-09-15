import { hasServiceAuthorization, hasSharedSecret } from "../_shared/authorization.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!hasServiceAuthorization(req, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) &&
      !hasSharedSecret(req, "x-webhook-secret", Deno.env.get("LEAD_WEBHOOK_SECRET"))) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const payload = await req.json();
    const lead = payload.record ?? {};

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const defaultBody =
      (lead.name || "Someone") +
      " is interested in " +
      (lead.service_type || "your services") +
      ".";

    const response = await fetch(supabaseUrl + "/functions/v1/send-push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + serviceKey,
      },
      body: JSON.stringify({
        title: "New Lead Received",
        body: defaultBody,
        source: lead.source ?? null,
        name: lead.name ?? null,
      }),
    });

    if (!response.ok) throw new Error("Notification delivery failed");
    const result = await response.json();

    return new Response(JSON.stringify({ ok: true, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
