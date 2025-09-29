// src/app/api/game/admin/quizz/create/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.id || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { category, difficulty, question, answer } = await req.json().catch(() => ({} as any))
  if (!question || !answer || !difficulty || !category) {
    return NextResponse.json({ message: 'Champs requis manquants' }, { status: 400 })
  }

  const userId = String((session.user as any).id)

  try {
    const created = await db.quizz.create({
      data: {
        question: String(question).trim(),
        answer: String(answer).trim(),
        difficulty: String(difficulty).trim(),
        category: String(category).trim(),
        status: false, // en attente de validation
        points: 0,     // attribué à la validation
        // ✅ relation requise vers l’auteur de la proposition
        createdByUser: { connect: { id: userId } },
        // Si ton schéma expose plutôt une FK: createdByUserId
        // createdByUserId: userId,
      },
      select: { id: true },
    })

    return NextResponse.json({ ok: true, id: created.id })
  } catch (e) {
    console.error('POST /api/game/admin/quizz/create error:', e)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}
