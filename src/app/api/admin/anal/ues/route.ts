// src/app/api/admin/anal/ues/route.ts
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
  const { semestreId, ueNumber, nomUe } = await req.json();
  if (!semestreId || !ueNumber) {
    return NextResponse.json({ error: 'semestreId & ueNumber requis' }, { status: 400 });
  }
  const u = await db.ue.create({ data: { semestreId, ueNumber: Number(ueNumber), nomUe: nomUe ?? null } });
  return NextResponse.json({ ue: u });
}
