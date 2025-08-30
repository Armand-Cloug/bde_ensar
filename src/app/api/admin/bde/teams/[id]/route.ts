// src/app/api/admin/bde/teams/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Suppression de l'équipe ; les membres liés seront supprimés
  // automatiquement grâce au onDelete: Cascade sur BdeTeamMember.team
  await db.bdeTeam.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
