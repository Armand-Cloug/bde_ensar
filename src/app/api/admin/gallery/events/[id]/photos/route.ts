// app/api/admin/gallery/events/[id]/photos/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const photos = await db.galleryPhoto.findMany({
    where: { galleryEventId: id },
    orderBy: { id: "desc" },
    select: { id: true, imagePath: true, caption: true, hasImageRights: true },
  });

  return NextResponse.json({ photos });
}
