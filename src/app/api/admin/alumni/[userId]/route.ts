// app/api/admin/alumni/requests/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

function isAdmin(session: any) {
  return !!session?.user && (session.user as any).role === "admin";
}

type Statut = "en_attente" | "valide" | "refuse";

/**
 * PATCH: changer le statut d'une demande alumni
 * body: { statut: "en_attente" | "valide" | "refuse" }
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const statut: Statut | undefined = body?.statut;

  if (!statut || !["en_attente", "valide", "refuse"].includes(statut)) {
    return NextResponse.json(
      { error: "Invalid 'statut' (en_attente | valide | refuse)" },
      { status: 400 }
    );
  }

  // Met à jour la requête
  const updated = await db.alumniRequest.update({
    where: { id },
    data: { statut },
    select: { id: true, userId: true, statut: true },
  });

  // Répercute sur le user si besoin
  if (statut === "valide") {
    await db.user.update({
      where: { id: updated.userId },
      data: { isAlumni: true },
    });
  } else if (statut === "refuse") {
    await db.user.update({
      where: { id: updated.userId },
      data: { isAlumni: false },
    });
  }

  return NextResponse.json({ ok: true, request: updated });
}

/**
 * DELETE: supprimer la demande
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await db.alumniRequest.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
