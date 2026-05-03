import { NextRequest, NextResponse } from "next/server";
import { getCampusByToken } from "@/lib/intake/server";
import { listRepositoryPhotos } from "@/lib/intake/photo-repository";
import { PHOTO_CATEGORIES, type PhotoCategory } from "@/lib/intake/sections";

export const runtime = "nodejs";

// GET /api/intake/photos/list?token=…&category=…
// Returns the campus's repository photos with signed URLs + assignment status.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "missing token" }, { status: 400 });
  const campus = await getCampusByToken(token);
  if (!campus) return NextResponse.json({ error: "invalid token" }, { status: 401 });

  const categoryRaw = req.nextUrl.searchParams.get("category");
  const validCategories = PHOTO_CATEGORIES.map((c) => c.value) as PhotoCategory[];
  const category =
    categoryRaw && validCategories.includes(categoryRaw as PhotoCategory)
      ? (categoryRaw as PhotoCategory)
      : undefined;

  const photos = await listRepositoryPhotos(campus.slug, { category });
  return NextResponse.json({ photos });
}
