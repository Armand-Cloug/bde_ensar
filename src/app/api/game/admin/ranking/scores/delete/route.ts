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

  const { scoreId, game } = await req.json().catch(() => ({} as any))
  if (!scoreId || !game) {
    return NextResponse.json({ message: 'scoreId et game sont requis' }, { status: 400 })
  }

  const Score = scoreDelegate(String(game))
  if (!Score) {
    return NextResponse.json({ message: 'Jeu inconnu' }, { status: 400 })
  }

  try {
    await Score.delete({ where: { id: String(scoreId) } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    // Prisma jette si l'id n'existe pas
    return NextResponse.json({ message: 'Score introuvable' }, { status: 404 })
  }
}
