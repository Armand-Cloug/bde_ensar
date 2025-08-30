// src/app/api/admin/gallery/photos/[photosId]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rm } from "fs/promises";

import path from "path";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ photoId: string }> }
) {
  const { photoId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const photo = await db.galleryPhoto.findUnique({ where: { id: photoId } });
  if (!photo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Construire le chemin disque depuis imagePath (/upload/<eventId>/<file>)
  const rel = photo.imagePath.replace(/^\/+/, ""); // supprime le "/" initial
  const diskPath = path.join(process.cwd(), "public", rel);

  // Suppression en DB + suppression du fichier physique
  await db.galleryPhoto.delete({ where: { id: photoId } });
  await rm(diskPath, { force: true });

  return NextResponse.json({ ok: true });
}
