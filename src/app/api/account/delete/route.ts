// src/app/api/account/delete/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = String(session.user.id);

  // ⚠️ Suppression "hard" : s'appuie sur les onDelete: Cascade déjà définis.
  // Si certains liens ne sont pas en cascade, adapter ici (nullify / deleteMany).
  try {
    await db.user.delete({ where: { id: userId } });
  } catch (e) {
    // Dernier recours : soft delete possible (ajouter un champ deletedAt si besoin).
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
