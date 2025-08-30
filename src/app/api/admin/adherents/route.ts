// src/app/api/admin/adherents/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') ?? '').trim();
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const pageSize = Math.max(1, Math.min(50, Number(searchParams.get('pageSize') ?? 15)));
    const skip = (page - 1) * pageSize;

    const where =
      q.length > 0
        ? {
            isAdherent: true,
            OR: [
              { firstName: { contains: q } }, // pas de mode: 'insensitive' pour rester compatible ta version Prisma
              { lastName:  { contains: q } },
              { email:     { contains: q } },
            ],
          }
        : { isAdherent: true };

    const [total, rows] = await Promise.all([
      db.user.count({ where }),
      db.user.findMany({
        where,
        orderBy: { adhesionEnd: 'desc' }, // tu peux changer le tri
        skip,
        take: pageSize,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          adhesionStart: true,
          adhesionEnd: true,
        },
      }),
    ]);

    return NextResponse.json({ total, adherents: rows });
  } catch (err) {
    console.error('GET /api/admin/adherents error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
