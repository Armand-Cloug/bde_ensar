import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const best = await db.scoreQuizz.findFirst({
    where: { userId: String(user.id) },
    orderBy: [{ score: "desc" }, { createdAt: "asc" }],
    select: { score: true },
  });

  return NextResponse.json({ score: best?.score ?? 0 });
}
