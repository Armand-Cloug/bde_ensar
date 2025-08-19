// app/api/alumni/request/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import * as z from "zod";

const Schema = z.object({
  diplome: z.string().min(1, "Diplôme requis"),
  anneeObtention: z.coerce.number().int().min(1900).max(2100),
  message: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = String(session.user.id);

  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { diplome, anneeObtention, message } = parsed.data;

  const existing = await db.alumniRequest.findFirst({
    where: { userId, statut: "pending" },
  });
  if (existing) return NextResponse.json({ ok: true }, { status: 200 });

  await db.alumniRequest.create({
    data: {
      userId,
      diplome,
      anneeObtention,
      // status: "pending", // si default en DB, inutile
      // message,           // ajoute ce champ dans Prisma si tu le veux
    } as any,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
