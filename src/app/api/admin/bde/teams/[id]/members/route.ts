import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import * as z from "zod";

const Schema = z.object({
  email: z.string().email(),
  poste: z.string().min(1),
  photo: z.string().url().optional(),
  description: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: teamId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { email, poste, photo, description } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Vérifie si déjà membre (optionnel si tu n'as pas @@unique([teamId,userId]))
  const exists = await db.bdeTeamMember.findFirst({ where: { teamId, userId: user.id } });
  if (exists) {
    return NextResponse.json({ error: "Already a member of this team" }, { status: 409 });
  }

  await db.bdeTeamMember.create({
    data: { teamId, userId: user.id, poste, photo, description },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
