import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/providers/email";
import { pushToCRM } from "@/lib/providers/crm";
import { saveToInbox } from "@/lib/inbox";

export const runtime = "nodejs";

type ContactPayload = {
  team: string;
  name?: string;
  email: string;
  campus?: string;
  message: string;
  urgent?: boolean;
};

const TEAM_SLA: Record<string, string> = {
  pastoral: "24 hours",
  campus: "48 hours",
  media: "3 business days",
  partnerships: "3 business days",
  finance: "2 business days",
  technical: "2 business days",
  prayer: "same day",
};

export async function POST(req: Request) {
  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  if (!body.team || !body.email || !body.message) {
    return NextResponse.json({ ok: false, error: "missing-fields" }, { status: 400 });
  }

  const sla = TEAM_SLA[body.team] ?? "3 business days";

  // Persist first — durable record even if email/CRM aren't yet wired.
  await saveToInbox({
    source: "contact",
    name: body.name,
    email: body.email,
    campusSlug: body.campus,
    team: body.team,
    urgent: body.urgent ?? false,
    body: { ...body, sla },
  });

  await pushToCRM({
    source: "contact",
    lifecycle: body.urgent ? "urgent" : "new",
    data: { ...body, sla },
  });

  await sendEmail({
    template: "contact-routed",
    to: body.email,
    subject: "We got your note.",
    data: { team: body.team, sla },
  });

  return NextResponse.json({ ok: true, sla, team: body.team });
}
