import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ users: [] })
  }

  const users = await db.user.findMany({
    where: {
      OR: [
        { firstName: { contains: q } },
        { lastName: { contains: q } },
        { email: { contains: q } },
      ],
    },
    select: { id: true, firstName: true, lastName: true, email: true },
    take: 20,
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
  })

  return NextResponse.json({ users })
}
