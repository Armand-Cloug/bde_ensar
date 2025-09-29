import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function mapDiffToInternal(v: string) {
  const x = String(v).toLowerCase();
  if (x === "difficile" || x === "hard") return "hard";
  if (x === "moyen" || x === "medium") return "medium";
  return "easy";
}
const ALLOWED_CATS = new Set(["general", "qse", "data", "ssi"]);

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { category, difficulty, question, answer } = await req.json().catch(() => ({} as any));
  if (!category || !difficulty || !question || !answer) {
    return NextResponse.json({ message: "Champs requis manquants" }, { status: 400 });
  }
  const cat = String(category).trim().toLowerCase();
  if (!ALLOWED_CATS.has(cat)) {
    return NextResponse.json({ message: "Catégorie invalide" }, { status: 400 });
  }
  const diff = mapDiffToInternal(difficulty);

  const created = await db.quizz.create({
    data: {
      question: String(question).trim(),
      answer: String(answer).trim(),
      difficulty: diff,      // stocké en interne
      category: cat,
      status: false,         // en attente
      points: 0,             // fixés à la validation par un admin
      createdByUser: { connect: { id: String(user.id) } }, // adapte si FK directe
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: created.id });
}
