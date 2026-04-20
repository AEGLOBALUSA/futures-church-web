export const runtime = "edge";

type Payload = {
  intent: string;
  data: Record<string, string>;
};

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body.intent || !body.data || typeof body.data !== "object") {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const endpoint = process.env.CRM_ENDPOINT;
  const token = process.env.CRM_TOKEN;

  const record = {
    intent: body.intent,
    data: body.data,
    receivedAt: new Date().toISOString(),
    source: "futures-church-web",
  };

  if (!endpoint) {
    console.log("[capture] (no CRM_ENDPOINT) record:", JSON.stringify(record));
    return Response.json({ ok: true, forwarded: false });
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(record),
    });
    if (!res.ok) {
      return Response.json({ ok: false, error: "crm_failed", status: res.status }, { status: 502 });
    }
    return Response.json({ ok: true, forwarded: true });
  } catch (err) {
    return Response.json({ ok: false, error: "crm_unreachable" }, { status: 502 });
  }
}
