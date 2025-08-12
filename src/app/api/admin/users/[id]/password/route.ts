import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import * as z from "zod";

const Schema = z.object({
  password: z.string().min(8, "Mot de passe trop court"),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }>}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const hashed = await hash(parsed.data.password, 10);
  await db.user.update({ where: { id }, data: { password: hashed } });
  return NextResponse.json({ ok: true });
}
