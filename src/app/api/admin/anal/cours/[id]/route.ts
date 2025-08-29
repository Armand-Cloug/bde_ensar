import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { unlink } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description } = await req.json();
  if (!title?.trim()) {
    return NextResponse.json({ error: "Titre requis" }, { status: 400 });
  }

  await db.cours.update({
    where: { id },
    data: {
      title,
      description: description ?? null,
    },
  });

  return NextResponse.json({ ok: true });
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

  const c = await db.cours.findUnique({
    where: { id },
    select: { filePath: true },
  });
  if (!c) {
    return NextResponse.json({ error: "Cours introuvable" }, { status: 404 });
  }

  // suppression fichier si local
  if (c.filePath?.startsWith("/upload/")) {
    const diskPath = path.join(process.cwd(), "public", c.filePath);
    try {
      await unlink(diskPath);
    } catch {
      // on ignore l'erreur si le fichier n’existe pas
    }
  }

  await db.cours.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
