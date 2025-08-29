import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import * as z from "zod";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const teams = await db.bdeTeam.findMany({
    orderBy: { annee: "desc" },
    include: { _count: { select: { members: true } } },
  });

  return NextResponse.json({
    teams: teams.map((t: any) => ({
      id: t.id,
      annee: t.annee,
      description: t.description,
      image: t.image,
      createdAt: t.createdAt,
      membersCount: t._count.members,
      isActive: t.isActive,               // ✅
    })),
  });
}

const CreateSchema = z.object({
  annee: z.string().min(4).max(20),
  description: z.string().min(1),
  image: z.string().url().optional().or(z.literal("")).transform(v => v || null),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const json = await req.json();
  const parsed = CreateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { annee, description, image } = parsed.data;

  const team = await db.bdeTeam.create({ data: { annee, description, image } });
  return NextResponse.json({ ok: true, team }, { status: 201 });
}
