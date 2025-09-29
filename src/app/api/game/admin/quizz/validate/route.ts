import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function allowedPointsFor(difficulty: string): number[] {
  const d = String(difficulty).trim().toLowerCase()
  if (['hard', 'difficile'].includes(d)) return [500, 750, 1000]
  if (['medium', 'moyen'].includes(d)) return [200, 300, 400]
  return [50, 100, 150] // easy / facile / par défaut
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id, points } = await req.json().catch(() => ({} as any))
  if (!id)   return NextResponse.json({ message: 'id requis' }, { status: 400 })
  if (points === undefined || points === null) {
    return NextResponse.json({ message: 'points requis' }, { status: 400 })
  }
  const pts = Number(points)
  if (!Number.isFinite(pts)) {
    return NextResponse.json({ message: 'points invalide' }, { status: 400 })
  }

  const q = await db.quizz.findUnique({ where: { id: String(id) } })
  if (!q)       return NextResponse.json({ message: 'Question introuvable' }, { status: 404 })
  if (q.status) return NextResponse.json({ message: 'Déjà validée' }, { status: 409 })

  const allowed = allowedPointsFor(q.difficulty)
  if (!allowed.includes(pts)) {
    return NextResponse.json({ message: `Points ${pts} non autorisés pour la difficulté "${q.difficulty}".` }, { status: 400 })
  }

  await db.quizz.update({
    where: { id: q.id },
    data: { status: true, points: pts },
  })

  return NextResponse.json({ ok: true, points: pts })
}
