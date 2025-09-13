// src/app/api/admin/gallery/events/[id]/upload/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mkdir, writeFile, stat, readdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

// Limites
const MAX_FILES_PER_BATCH = 100;
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 Mo
const MAX_FILES_PER_EVENT = 1000;
const MAX_BYTES_PER_EVENT = 2 * 1024 * 1024 * 1024; // 2 Go
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function extFromMime(mime: string) {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "bin";
  }
}

async function dirSize(dir: string) {
  let total = 0;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isFile()) {
      const s = await stat(path.join(dir, e.name));
      total += s.size;
    }
  }
  return total;
}

function isBlobLike(v: any): v is Blob {
  return v && typeof v.arrayBuffer === "function";
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: galleryEventId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = await db.galleryEvent.findUnique({
    where: { id: galleryEventId },
  });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const form = await req.formData();
  const files = form.getAll("files");
  const rightsStr = String(form.get("hasImageRights") ?? "true");
  const hasImageRights = rightsStr === "true";

  if (!files.length) {
    return NextResponse.json({ error: "No files" }, { status: 400 });
  }
  if (files.length > MAX_FILES_PER_BATCH) {
    return NextResponse.json(
      { error: `Max ${MAX_FILES_PER_BATCH} fichiers par lot` },
      { status: 400 }
    );
  }

  const currentCount = await db.galleryPhoto.count({
    where: { galleryEventId },
  });
  if (currentCount + files.length > MAX_FILES_PER_EVENT) {
    return NextResponse.json(
      { error: `Limite ${MAX_FILES_PER_EVENT} photos / événement atteinte` },
      { status: 400 }
    );
  }

  // Dossier correct: public/upload/gallery/<eventId>
  const baseDir = path.join(
    process.cwd(),
    "public",
    "upload",
    "gallery",
    galleryEventId
  );
  await mkdir(baseDir, { recursive: true });
  const currentBytes = await dirSize(baseDir);

  let addedBytes = 0;
  const created: { id: string; imagePath: string }[] = [];

  for (const anyFile of files) {
    if (!isBlobLike(anyFile)) continue;

    const f = anyFile as Blob & { type?: string; size?: number };
    const type = (f as any).type || "application/octet-stream";
    const size = Number((f as any).size ?? 0);

    if (!ALLOWED_TYPES.has(type)) {
      return NextResponse.json(
        { error: `Type non autorisé: ${type}` },
        { status: 400 }
      );
    }
    if (size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Fichier trop volumineux (>25 Mo)` },
        { status: 400 }
      );
    }
    if (currentBytes + addedBytes + size > MAX_BYTES_PER_EVENT) {
      return NextResponse.json(
        { error: `Taille totale > 2 Go` },
        { status: 400 }
      );
    }

    const ext = extFromMime(type);
    const safeName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;
    const diskPath = path.join(baseDir, safeName);
    const publicPath = path.posix.join(
      "/upload",
      "gallery",
      galleryEventId,
      safeName
    );

    const buf = Buffer.from(await f.arrayBuffer());
    await writeFile(diskPath, buf);
    addedBytes += size;

    const row = await db.galleryPhoto.create({
      data: {
        galleryEventId,
        imagePath: publicPath,
        caption: null,
        hasImageRights,
        uploadedBy: String((session.user as any).id),
      },
      select: { id: true, imagePath: true },
    });
    created.push(row);
  }

  return NextResponse.json({ ok: true, created });
}
