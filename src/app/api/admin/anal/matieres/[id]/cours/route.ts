// src/app/api/admin/anal/matieres/[id]/cours/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mkdir, writeFile } from "fs/promises";

import path from "path";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 Mo
const ALLOWED_TYPES = new Set(["application/pdf"]);

function safeName(ext: string) {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
}

function isBlobLike(v: any): v is Blob {
  return v && typeof v.arrayBuffer === "function";
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: matiereId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // vérifier que la matière existe
  const mat = await db.matiere.findUnique({
    where: { id: matiereId },
    select: { id: true },
  });
  if (!mat) {
    return NextResponse.json({ error: "Matière introuvable" }, { status: 404 });
  }

  const form = await req.formData();
  const title = String(form.get("title") ?? "").trim();
  const description = form.get("description")
    ? String(form.get("description"))
    : null;
  const fileAny = form.get("file");

  if (!title || !fileAny) {
    return NextResponse.json({ error: "Titre & fichier requis" }, { status: 400 });
  }
  if (!isBlobLike(fileAny)) {
    return NextResponse.json({ error: "Fichier invalide" }, { status: 400 });
  }

  const file = fileAny as Blob & { type?: string; size?: number };
  const type = (file as any).type || "application/octet-stream";
  const size = Number((file as any).size ?? 0);

  if (!ALLOWED_TYPES.has(type)) {
    return NextResponse.json({ error: "Seuls les PDF sont autorisés" }, { status: 400 });
  }
  if (size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Fichier trop volumineux (> 25 Mo)" }, { status: 400 });
  }

  const baseDir = path.join(process.cwd(), "public", "upload", "cours", matiereId);
  await mkdir(baseDir, { recursive: true });

  const ext = "pdf";
  const name = safeName(ext);
  const diskPath = path.join(baseDir, name);
  const publicPath = path.posix.join("/upload", "cours", matiereId, name);

  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(diskPath, buf);

  const created = await db.cours.create({
    data: {
      matiereId,
      title,
      description,
      filePath: publicPath,
      uploadedBy: String((session.user as any).id),
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: created.id });
}
