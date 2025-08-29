import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Vérifie l'existence
  const exists = await db.bdeTeam.findUnique({ where: { id } });
  if (!exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Une seule équipe active à la fois
  await db.$transaction([
    db.bdeTeam.updateMany({ data: { isActive: false } }),
    db.bdeTeam.update({ where: { id }, data: { isActive: true } }),
  ]);

  return NextResponse.json({ ok: true });
}
