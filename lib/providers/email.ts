type EmailTemplate =
  | "visit-confirmation"
  | "post-visit-follow-up"
  | "give-receipt"
  | "contact-routed"
  | "book-chapter"
  | "book-study-guide"
  | "book-coming-soon"
  | "bible-app-download-link";

type SendEmailArgs = {
  template: EmailTemplate;
  to: string;
  subject: string;
  data: Record<string, unknown>;
  sendAt?: number;
};

export async function sendEmail(args: SendEmailArgs): Promise<{ ok: boolean; provider: string; scheduled: boolean }> {
  const key = process.env.RESEND_API_KEY;
  const scheduled = typeof args.sendAt === "number" && args.sendAt > Date.now() + 60_000;

  if (!key) {
    console.log("[email:stub]", {
      template: args.template,
      to: args.to,
      subject: args.subject,
      data: args.data,
      scheduled,
      sendAt: args.sendAt ? new Date(args.sendAt).toISOString() : undefined,
    });
    return { ok: true, provider: "stub", scheduled };
  }

  const body: Record<string, unknown> = {
    from: process.env.RESEND_FROM ?? "Futures <hello@futures.church>",
    to: [args.to],
    subject: args.subject,
    text: buildTextBody(args),
  };
  if (args.sendAt) body.scheduled_at = new Date(args.sendAt).toISOString();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, provider: "resend", scheduled };
}

function buildTextBody(args: SendEmailArgs): string {
  const d = args.data as Record<string, string | number | undefined>;
  switch (args.template) {
    case "visit-confirmation":
      return `Hey ${d.firstName ?? "friend"} — Pastor ${d.pastorName ?? "the team"} at ${d.campus} will be watching for you on ${d.visitDate}. Park near the main entrance, look for the welcome desk, and text ${d.campusPhone ?? "the campus"} if you need anything.`;
    case "post-visit-follow-up":
      return `Hey ${d.firstName ?? "friend"} — it was good to have you on Sunday. Want to grab coffee with a pastor this week? Pick a time: ${d.calendarLink ?? "https://futures.church/contact"}`;
    case "give-receipt":
      return `Thanks for your gift of ${d.amountLabel}. Your receipt is attached. Every dollar, tracked.`;
    case "contact-routed":
      return `We got your note. Someone from ${d.team} will reply within ${d.sla}.`;
    case "book-chapter":
      return `Chapter 1 of ${d.bookTitle} is attached. Read it when it's quiet. Ashley & Jane.`;
    case "book-study-guide":
      return `Study guide for ${d.bookTitle} is attached. Use it solo or with a group.`;
    case "book-coming-soon":
      return `You're on the list for ${d.bookTitle}. We'll write the moment it ships.`;
    case "bible-app-download-link":
      return `Here's the download link for the Futures Bible app: ${d.link}`;
    default:
      return `Message from Futures.`;
  }
}
