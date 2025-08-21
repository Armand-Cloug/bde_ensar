// app/api/alumni/request/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import * as z from "zod";

const Schema = z.object({
  diplome: z.string().min(1),
  anneeObtention: z.coerce.number().int().min(1950).max(2100),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
  const { diplome, anneeObtention } = parsed.data;

  // Empêcher les doublons en attente
  const exists = await db.alumniRequest.findFirst({
    where: { userId: String(session.user.id), statut: "en_attente" },
  });
  if (exists) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  await db.alumniRequest.create({
    data: {
      userId: String(session.user.id),
      diplome,
      anneeObtention,
      // statut par défaut: en_attente (défini dans Prisma)
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
