// src/app/api/game/admin/ranking/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Retourne le délégué Prisma du score selon le jeu */
function scoreDelegate(game: string) {
  switch (game) {
    case 'quizz':
      return db.scoreQuizz
    // À étendre quand tu ajoutes d'autres jeux :
    // case 'game2': return db.scoreGame2
    // case 'game3': return db.scoreGame3
    // case 'game4': return db.scoreGame4
    default:
      return null
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const game = (searchParams.get('game') ?? 'quizz').trim()
    const q = (searchParams.get('q') ?? '').trim()
    const page = Math.max(1, Number(searchParams.get('page') ?? 1))
    const pageSize = Math.max(1, Math.min(50, Number(searchParams.get('pageSize') ?? 15)))
    const skip = (page - 1) * pageSize

    const Score = scoreDelegate(game)
    if (!Score) {
      return NextResponse.json({ total: 0, rows: [] })
    }

    // --- Filtrage par recherche utilisateur (nom/prénom/email) ---
    let where: any = {}
    if (q.length >= 2) {
      const users = await db.user.findMany({
        where: {
          OR: [
            { firstName: { contains: q } },
            { lastName:  { contains: q } },
            { email:     { contains: q } },
          ],
        },
        select: { id: true },
        take: 200,
      })
      const ids = users.map(u => String(u.id))
      if (ids.length === 0) {
        return NextResponse.json({ total: 0, rows: [] })
      }
      where.userId = { in: ids }
    }

    // --- Total de scores (pas distinct user) ---
    const total = await Score.count({ where })

    // --- Récupération des scores individuels (tri global) ---
    const scores = await Score.findMany({
      where,
      orderBy: [{ score: 'desc' }, { createdAt: 'asc' }],
      skip,
      take: pageSize,
      select: {
        id: true,
        userId: true,
        score: true,
        createdAt: true,
        // relation utilisateur pour l'affichage
        user: {
          select: {
            firstName: true,
            lastName: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    // --- Map vers le format attendu par le tableau admin ---
    const rows = scores.map((s: any, i: number) => {
      const u = s.user
      const displayName =
        (u?.firstName || u?.lastName
          ? `${u?.firstName ?? ''} ${u?.lastName ?? ''}`.trim()
          : u?.name) || 'Utilisateur'

      return {
        id: String(s.id),
        userId: String(s.userId),
        rank: skip + i + 1,       // rang dans le tri global (peut dupliquer un user)
        score: Number(s.score),
        createdAt: s.createdAt ?? null,
        user: {
          name: displayName,
          image: u?.image ?? null,
          email: u?.email ?? null,
        },
      }
    })

    return NextResponse.json({ total, rows })
  } catch (err) {
    console.error('GET /api/game/admin/ranking error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
