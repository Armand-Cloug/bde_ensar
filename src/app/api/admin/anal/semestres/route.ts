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
  const { formationId, semestre } = await req.json();
  if (!formationId || !semestre?.trim()) {
    return NextResponse.json({ error: 'formationId & semestre requis' }, { status: 400 });
  }
  const s = await db.semestre.create({ data: { formationId, semestre } });
  return NextResponse.json({ semestre: s });
}
