// src/app/api/admin/adherents/search/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function nextSeptember1(from: Date) {
  const year = from.getUTCFullYear();
  const sept1 = new Date(Date.UTC(year, 8, 1, 0, 0, 0)); // mois 8 = septembre
  return from.getTime() < sept1.getTime() ? sept1 : new Date(Date.UTC(year + 1, 8, 1, 0, 0, 0));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await req.json().catch(() => ({} as any));
  if (!userId) {
    return NextResponse.json({ message: "userId requis" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { id: String(userId) } });
  if (!user) {
    return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 });
  }
  if (user.isAdherent) {
    return NextResponse.json({ message: "Déjà adhérent" }, { status: 409 });
  }

  const now = new Date();
  const end = nextSeptember1(now);

  await db.user.update({
    where: { id: String(userId) },
    data: {
      isAdherent: true,
      adhesionStart: now,
      adhesionEnd: end,
    },
  });

  return NextResponse.json({ ok: true });
}
