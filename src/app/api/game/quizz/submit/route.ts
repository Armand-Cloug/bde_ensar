import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { score } = await req.json().catch(() => ({} as any));
  const s = Number(score);
  if (!Number.isFinite(s)) {
    return NextResponse.json({ message: "score invalide" }, { status: 400 });
  }

  await db.scoreQuizz.create({
    data: {
      userId: String(user.id),
      score: s,
    },
  });

  return NextResponse.json({ ok: true });
}
