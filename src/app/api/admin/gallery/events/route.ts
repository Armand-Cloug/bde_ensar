// app/api/admin/gallery/events/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await db.galleryEvent.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      isActive: true,
      coverImage: true,
      createdAt: true,
      _count: { select: { photos: true } },
    },
  });

  return NextResponse.json({ events });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  const title = (body?.title ?? "").trim();
  const description = (body?.description ?? "").trim() || null;
  const isActive = Boolean(body?.isActive);
  const coverImage = (body?.coverImage ?? "").trim() || null;

  if (!title) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }

  const created = await db.galleryEvent.create({
    data: { title, description, isActive, coverImage },
    select: { id: true },
  });

  // Créer le dossier /public/upload/<eventId>/
  const uploadDir = path.join(process.cwd(), "public", "upload", created.id);
  await mkdir(uploadDir, { recursive: true });

  return NextResponse.json({ id: created.id }, { status: 201 });
}
