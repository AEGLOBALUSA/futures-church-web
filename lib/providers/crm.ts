type CRMPayload = {
  source: string;
  lifecycle?: string;
  data: Record<string, unknown>;
};

export async function pushToCRM(payload: CRMPayload): Promise<{ ok: boolean; provider: string }> {
  const endpoint = process.env.CRM_ENDPOINT;
  const token = process.env.CRM_TOKEN;
  const body = { ...payload, receivedAt: new Date().toISOString() };

  if (!endpoint) {
    console.log("[crm:stub]", body);
    return { ok: true, provider: "stub" };
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, provider: "crm" };
}
