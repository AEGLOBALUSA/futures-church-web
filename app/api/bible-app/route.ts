import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/providers/email";
import { pushToCRM } from "@/lib/providers/crm";

export const runtime = "nodejs";

type Payload = {
  email: string;
  platform?: "ios" | "android" | "other";
};

const IOS_URL = "https://apps.apple.com/app/futures-church";
const ANDROID_URL = "https://play.google.com/store/apps/details?id=church.futures.app";

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }
  if (!body.email) return NextResponse.json({ ok: false, error: "missing-email" }, { status: 400 });

  const link = body.platform === "android" ? ANDROID_URL : body.platform === "ios" ? IOS_URL : `${IOS_URL}  |  ${ANDROID_URL}`;

  await pushToCRM({
    source: "bible-app",
    lifecycle: "app-interested",
    data: { email: body.email, platform: body.platform ?? "unknown" },
  });

  await sendEmail({
    template: "bible-app-download-link",
    to: body.email,
    subject: "Your Futures Bible app download link.",
    data: { link },
  });

  return NextResponse.json({ ok: true });
}
