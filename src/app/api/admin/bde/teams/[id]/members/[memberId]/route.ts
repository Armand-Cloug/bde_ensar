// src/app/api/admin/bde/teams/[id]/members/[memberId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  const { id: teamId, memberId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Vérifie que le membre appartient bien à cette équipe
  const member = await db.bdeTeamMember.findUnique({
    where: { id: memberId },
    select: { teamId: true },
  });
  if (!member || member.teamId !== teamId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.bdeTeamMember.delete({ where: { id: memberId } });

  return NextResponse.json({ ok: true });
}
