// src/app/api/admin/gallery/events/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rm } from "fs/promises";

import path from "path";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ev = await db.galleryEvent.findUnique({
    where: { id },
    include: { photos: { orderBy: { id: "desc" } } },
  });

  if (!ev) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ event: ev });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // body reste vide si parsing échoue
  }

  const data: any = {};
  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.description === "string") {
    data.description = body.description.trim() || null;
  }
  if (typeof body.isActive === "boolean") data.isActive = body.isActive;
  if (typeof body.coverImage === "string") {
    data.coverImage = body.coverImage.trim() || null;
  }

  const updated = await db.galleryEvent.update({
    where: { id },
    data,
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: updated.id });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Supprimer en DB (photos supprimées en cascade)
  await db.galleryEvent.delete({ where: { id } });

  // Supprimer le dossier physique lié (si existe)
  const dir = path.join(process.cwd(), "public", "upload", id);
  await rm(dir, { recursive: true, force: true });

  return NextResponse.json({ ok: true });
}
