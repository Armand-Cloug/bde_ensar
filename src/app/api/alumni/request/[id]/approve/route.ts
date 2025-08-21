// app/api/admin/alumni/requests/[id]/approve/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const req = await db.alumniRequest.findUnique({ where: { id: params.id } });
  if (!req) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.$transaction([
    db.alumniRequest.update({ where: { id: params.id }, data: { statut: "valide" } }),
    db.user.update({ where: { id: req.userId }, data: { isAlumni: true } }),
  ]);

  return NextResponse.json({ ok: true });
}
