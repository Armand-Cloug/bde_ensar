// app/api/admin/alumni/requests/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action } = await req.json(); // 'approve' | 'reject'
  const id = params.id;

  const found = await db.alumniRequest.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "approve") {
    await db.$transaction([
      db.alumniRequest.update({
        where: { id },
        data: { statut: "valide" },
      }),
      db.user.update({
        where: { id: found.userId },
        data: { isAlumni: true },
      }),
    ]);
  } else if (action === "reject") {
    await db.alumniRequest.update({
      where: { id },
      data: { statut: "refuse" },
    });
  } else {
    return NextResponse.json({ error: "Bad action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
