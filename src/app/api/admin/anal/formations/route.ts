import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { nom } = await req.json();
  if (!nom?.trim()) return NextResponse.json({ error: 'Nom requis' }, { status: 400 });

  const f = await db.formation.create({ data: { nom } });
  return NextResponse.json({ formation: f });
}
