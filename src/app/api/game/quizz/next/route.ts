import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const category = (searchParams.get("category") ?? "all").trim();
  const diffsCsv = (searchParams.get("diffs") ?? "easy,medium,hard").trim();
  const excludeCsv = (searchParams.get("exclude") ?? "").trim();

  const diffs = diffsCsv
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const excludeIds = excludeCsv
    ? excludeCsv.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const where: any = {
    status: true,
    difficulty: { in: diffs },
  };
  if (category !== "all") where.category = category;

  // On tire une poignée de questions puis on choisit aléatoirement côté serveur
  const pool = await db.quizz.findMany({
    where: excludeIds.length ? { ...where, id: { notIn: excludeIds } } : where,
    select: { id: true, question: true, answer: true, difficulty: true, category: true, points: true },
    take: 50,
    orderBy: { createdAt: "desc" },
  });

  if (pool.length === 0) {
    return NextResponse.json({ message: "no-question" }, { status: 404 });
  }

  const pick = pool[Math.floor(Math.random() * pool.length)];
  return NextResponse.json({
    id: pick.id,
    question: pick.question,
    answer: pick.answer,        // simplification (sinon prévoir endpoint /check)
    difficulty: pick.difficulty,
    category: pick.category,
    points: pick.points ?? 0,
  });
}
