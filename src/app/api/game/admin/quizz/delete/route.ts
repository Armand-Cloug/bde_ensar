import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json().catch(() => ({} as any))
  if (!id) return NextResponse.json({ message: 'id requis' }, { status: 400 })

  try {
    await db.quizz.delete({ where: { id: String(id) } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ message: 'Question introuvable' }, { status: 404 })
  }
}
