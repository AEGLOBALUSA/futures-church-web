import { NextRequest, NextResponse } from "next/server";
import { getCampusByToken } from "@/lib/intake/server";
import { updateEvent, deleteEvent, type EventCategory } from "@/lib/events/server";

export const runtime = "nodejs";

async function authOrFail(token: unknown) {
  if (typeof token !== "string") return { error: "missing token", status: 400 as const };
  const campus = await getCampusByToken(token);
  if (!campus) return { error: "invalid token", status: 401 as const };
  return { campus };
}

// PATCH /api/intake/events/[id] — update event
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const auth = await authOrFail(body.token);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const result = await updateEvent(id, auth.campus.slug, {
    category: typeof body.category === "string" ? (body.category as EventCategory) : undefined,
    title: typeof body.title === "string" ? body.title : undefined,
    description: body.description === null || typeof body.description === "string" ? (body.description as string | null) : undefined,
    startsAt: typeof body.startsAt === "string" ? body.startsAt : undefined,
    endsAt: body.endsAt === null || typeof body.endsAt === "string" ? (body.endsAt as string | null) : undefined,
    allDay: typeof body.allDay === "boolean" ? body.allDay : undefined,
    location: body.location === null || typeof body.location === "string" ? (body.location as string | null) : undefined,
    audience: Array.isArray(body.audience) ? (body.audience as string[]) : undefined,
    registrationUrl: body.registrationUrl === null || typeof body.registrationUrl === "string" ? (body.registrationUrl as string | null) : undefined,
    isFeatured: typeof body.isFeatured === "boolean" ? body.isFeatured : undefined,
    isPublished: typeof body.isPublished === "boolean" ? body.isPublished : undefined,
    recurrence: typeof body.recurrence === "string" ? (body.recurrence as "none" | "weekly" | "biweekly" | "monthly") : undefined,
    coverImagePath: body.coverImagePath === null || typeof body.coverImagePath === "string" ? (body.coverImagePath as string | null) : undefined,
    updatedBy: typeof body.editedBy === "string" ? body.editedBy : null,
  });

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });

  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath(`/campuses/${auth.campus.slug}`);
    revalidatePath("/");
  } catch {
    /* noop */
  }

  return NextResponse.json({ ok: true, event: result.event });
}

// DELETE /api/intake/events/[id] — delete event
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    /* DELETE may have no body; auth via query string fallback */
  }
  let token: unknown = body.token;
  if (typeof token !== "string") {
    token = req.nextUrl.searchParams.get("token");
  }
  const auth = await authOrFail(token);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const ok = await deleteEvent(id, auth.campus.slug, typeof body.editedBy === "string" ? body.editedBy : null);
  if (!ok) return NextResponse.json({ error: "delete failed" }, { status: 500 });

  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath(`/campuses/${auth.campus.slug}`);
    revalidatePath("/");
  } catch {
    /* noop */
  }

  return NextResponse.json({ ok: true });
}
