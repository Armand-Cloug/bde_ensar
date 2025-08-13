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
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Optionnel : vérifier que le membre appartient bien à cette team
  const m = await db.bdeTeamMember.findUnique({ where: { id: memberId }, select: { teamId: true } });
  if (!m || m.teamId !== teamId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.bdeTeamMember.delete({ where: { id: memberId } });

  return NextResponse.json({ ok: true });
}
