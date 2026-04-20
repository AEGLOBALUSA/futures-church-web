import { NextResponse } from "next/server";
import { pushToCRM } from "@/lib/providers/crm";

export const runtime = "nodejs";

type GivePayload = {
  amount: number;
  currency: "USD" | "AUD" | "IDR";
  path: "tithe" | "offering" | "vision" | "capital";
  fund?: string;
  recurring?: "monthly" | null;
  email?: string;
  name?: string;
};

export async function POST(req: Request) {
  let body: GivePayload;
  try {
    body = (await req.json()) as GivePayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  if (!body.amount || body.amount <= 0) {
    return NextResponse.json({ ok: false, error: "invalid-amount" }, { status: 400 });
  }
  if (!body.currency || !body.path) {
    return NextResponse.json({ ok: false, error: "missing-fields" }, { status: 400 });
  }

  await pushToCRM({
    source: "give-interest",
    lifecycle: body.recurring === "monthly" ? "partner-interest" : "gift-interest",
    data: {
      path: body.path,
      fund: body.fund,
      amount: body.amount,
      currency: body.currency,
      recurring: body.recurring ?? null,
      email: body.email,
      name: body.name,
    },
  });

  return NextResponse.json({ ok: true });
}
