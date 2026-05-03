import { NextResponse } from "next/server";
import { pushToCRM } from "@/lib/providers/crm";
import { sendEmail } from "@/lib/providers/email";
import { sendSMS } from "@/lib/providers/sms";
import { getCampusContact } from "@/lib/content/campus-contact";
import { saveToInbox } from "@/lib/inbox";

export const runtime = "nodejs";

type VisitPayload = {
  campusSlug: string;
  campusName: string;
  visitDate: string;
  adults?: number;
  kidsAges?: string;
  mobilityNotes?: string;
  name?: string;
  email?: string;
  phone?: string;
};

export async function POST(req: Request) {
  let body: VisitPayload;
  try {
    body = (await req.json()) as VisitPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  if (!body.campusSlug || !body.visitDate || (!body.email && !body.phone)) {
    return NextResponse.json(
      { ok: false, error: "missing-required-fields" },
      { status: 400 }
    );
  }

  const contact = getCampusContact(body.campusSlug);
  const visitTime = Date.parse(body.visitDate);
  const firstName = (body.name ?? "").split(" ")[0] || "friend";

  // Persist first so the campus team always has the record,
  // even if email/SMS keys aren't set yet.
  await saveToInbox({
    source: "visit",
    name: body.name,
    email: body.email,
    phone: body.phone,
    campusSlug: body.campusSlug,
    body: { ...body, campusPastor: contact.pastorName },
  });

  await pushToCRM({
    source: "plan-a-visit",
    lifecycle: "new",
    data: { ...body, campusPastor: contact.pastorName },
  });

  if (body.email) {
    await sendEmail({
      template: "visit-confirmation",
      to: body.email,
      subject: "We\u2019re saving you a seat.",
      data: {
        firstName,
        pastorName: contact.pastorName,
        campus: body.campusName,
        visitDate: body.visitDate,
        campusPhone: contact.campusPhone,
      },
    });

    if (!Number.isNaN(visitTime)) {
      await sendEmail({
        template: "post-visit-follow-up",
        to: body.email,
        subject: "Thanks for coming.",
        sendAt: visitTime + 8 * 60 * 60 * 1000,
        data: {
          firstName,
          calendarLink: `https://futures.church/contact?campus=${body.campusSlug}`,
        },
      });
    }
  }

  if (body.phone && !Number.isNaN(visitTime)) {
    await sendSMS({
      to: body.phone,
      sendAt: visitTime - 24 * 60 * 60 * 1000,
      body: `Hey, it's Pastor ${contact.pastorFirst} at Futures ${body.campusName}. Just saving a seat for you Sunday. Text me back if you need anything. \u2014 ${contact.pastorFirst}`,
    });
  }

  return NextResponse.json({ ok: true });
}
