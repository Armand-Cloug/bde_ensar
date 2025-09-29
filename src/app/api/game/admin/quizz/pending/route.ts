import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const pageSize = Math.max(1, Math.min(50, Number(searchParams.get('pageSize') ?? 15)))
  const skip = (page - 1) * pageSize

  const where = { status: false }

  const [total, rows] = await Promise.all([
    db.quizz.count({ where }),
    db.quizz.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      skip,
      take: pageSize,
      select: { id: true, question: true, answer: true, points: true, difficulty: true, status: true, createdAt: true, category: true },
    }),
  ])

  return NextResponse.json({ total, rows })
}
