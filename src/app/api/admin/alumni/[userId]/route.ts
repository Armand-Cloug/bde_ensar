// app/api/admin/alumni/[userId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

type RouteCtx = { params: Record<string, string | string[]> };

export async function DELETE(_req: Request, { params }: RouteCtx) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Récupère userId, qu'il soit string ou string[]
  const raw = params["userId"];
  const userId = Array.isArray(raw) ? raw[0] : raw;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  await db.user.update({
    where: { id: userId },
    data: { isAlumni: false },
  });

  return NextResponse.json({ ok: true });
}
