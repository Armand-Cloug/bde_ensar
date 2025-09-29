import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function scoreDelegate(game: string) {
  switch (game) {
    case 'quizz':
      return db.scoreQuizz
    // TODO: case 'game2': return db.scoreGame2
    // TODO: case 'game3': return db.scoreGame3
    // TODO: case 'game4': return db.scoreGame4
    default:
      return null
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { userId, game, score } = await req.json().catch(() => ({} as any))
  if (!userId || !game || (score === undefined || score === null)) {
    return NextResponse.json({ message: 'userId, game et score sont requis' }, { status: 400 })
  }

  const s = Number(score)
  if (!Number.isFinite(s)) {
    return NextResponse.json({ message: 'score invalide' }, { status: 400 })
  }

  const Score = scoreDelegate(String(game))
  if (!Score) {
    return NextResponse.json({ message: 'Jeu inconnu' }, { status: 400 })
  }

  const user = await db.user.findUnique({ where: { id: String(userId) } })
  if (!user) {
    return NextResponse.json({ message: 'Utilisateur introuvable' }, { status: 404 })
  }

  const created = await Score.create({
    data: { userId: String(userId), score: s },
  })

  return NextResponse.json({ ok: true, id: created.id })
}
