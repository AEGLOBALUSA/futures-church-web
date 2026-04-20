type SendSMSArgs = {
  to: string;
  body: string;
  sendAt?: number;
};

export async function sendSMS(args: SendSMSArgs): Promise<{ ok: boolean; provider: string; scheduled: boolean }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  const scheduled = typeof args.sendAt === "number" && args.sendAt > Date.now() + 60_000;

  if (!accountSid || !authToken || !from) {
    console.log("[sms:stub]", {
      to: args.to,
      body: args.body,
      scheduled,
      sendAt: args.sendAt ? new Date(args.sendAt).toISOString() : undefined,
    });
    return { ok: true, provider: "stub", scheduled };
  }

  if (scheduled) {
    console.log("[sms:scheduled-queue-pending]", {
      to: args.to,
      sendAt: new Date(args.sendAt!).toISOString(),
    });
    return { ok: true, provider: "twilio-scheduled-stub", scheduled: true };
  }

  const form = new URLSearchParams({ To: args.to, From: from, Body: args.body });
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      },
      body: form.toString(),
    }
  );
  return { ok: res.ok, provider: "twilio", scheduled: false };
}
