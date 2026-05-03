import { NextRequest, NextResponse } from "next/server";
import { getCampusByToken } from "@/lib/intake/server";
import { createEvent, type EventCategory } from "@/lib/events/server";

export const runtime = "nodejs";

const VALID_CATEGORIES: EventCategory[] = [
  "service",
  "kids",
  "youth",
  "women",
  "men",
  "prayer",
  "special",
  "conference",
  "general",
];

// POST /api/intake/events — create event
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const token = body.token;
  if (typeof token !== "string") {
    return NextResponse.json({ error: "missing token" }, { status: 400 });
  }
  const campus = await getCampusByToken(token);
  if (!campus) {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const category = body.category as string;
  const startsAt = typeof body.startsAt === "string" ? body.startsAt : "";

  if (!title || title.length > 200) {
    return NextResponse.json({ error: "title required (max 200 chars)" }, { status: 400 });
  }
  if (!VALID_CATEGORIES.includes(category as EventCategory)) {
    return NextResponse.json({ error: "invalid category" }, { status: 400 });
  }
  if (!startsAt || isNaN(new Date(startsAt).getTime())) {
    return NextResponse.json({ error: "invalid startsAt" }, { status: 400 });
  }

  const result = await createEvent({
    campusSlug: campus.slug,
    category: category as EventCategory,
    title,
    description: typeof body.description === "string" ? body.description : null,
    startsAt,
    endsAt: typeof body.endsAt === "string" ? body.endsAt : null,
    allDay: typeof body.allDay === "boolean" ? body.allDay : false,
    location: typeof body.location === "string" ? body.location : null,
    audience: Array.isArray(body.audience) ? (body.audience as string[]) : undefined,
    registrationUrl: typeof body.registrationUrl === "string" ? body.registrationUrl : null,
    isFeatured: typeof body.isFeatured === "boolean" ? body.isFeatured : false,
    isPublished: typeof body.isPublished === "boolean" ? body.isPublished : true,
    recurrence: (body.recurrence as "none" | "weekly" | "biweekly" | "monthly") ?? "none",
    coverImagePath: typeof body.coverImagePath === "string" ? body.coverImagePath : null,
    createdBy: typeof body.editedBy === "string" ? body.editedBy : null,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  // Revalidate the public campus page so the new event shows up immediately.
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath(`/campuses/${campus.slug}`);
    revalidatePath("/");
  } catch {
    /* noop in environments without cache module */
  }

  return NextResponse.json({ ok: true, event: result.event });
}
