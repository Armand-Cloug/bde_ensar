// app/api/admin/events/[id]/page/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Génère un slug unique de type `event-xxxxxxxx` (8 chars base36).
 * On boucle jusqu'à trouver un slug absent (slug est unique en DB).
 */
async function generateUniqueSlug() {
  while (true) {
    const rand = Math.random().toString(36).slice(2, 10); // 8 chars
    const slug = `event-${rand}`;
    const exists = await db.eventPage.findUnique({ where: { slug } });
    if (!exists) return slug;
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const page = await db.eventPage.findFirst({
    where: { eventId: id },
    select: { id: true, slug: true, contentHtml: true },
  });
  return NextResponse.json({ page }); // page peut être null si non créé
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // ignore
  }

  // On attend un champ "content" (texte simple), pas de HTML ni de slug côté client
  const content: string = typeof body?.content === "string" ? body.content : "";

  if (!content.trim()) {
    return NextResponse.json(
      { error: "Le contenu (texte) est requis." },
      { status: 400 }
    );
  }

  // Existe déjà ?
  const existing = await db.eventPage.findFirst({
    where: { eventId: id },
    select: { id: true, slug: true },
  });

  if (existing) {
    await db.eventPage.update({
      where: { id: existing.id },
      data: {
        // On stocke le texte dans contentHtml (mal nommé mais OK)
        contentHtml: content,
      },
    });
    return NextResponse.json({ ok: true, slug: existing.slug });
  } else {
    // Créer avec un slug auto-unique
    const slug = await generateUniqueSlug();
    await db.eventPage.create({
      data: {
        eventId: id,
        slug,
        contentHtml: content,
        contentJson: null,
      },
    });
    return NextResponse.json({ ok: true, slug });
  }
}
