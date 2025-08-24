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
  const { ueId, nomMatiere } = await req.json();
  if (!ueId || !nomMatiere?.trim()) {
    return NextResponse.json({ error: 'ueId & nomMatiere requis' }, { status: 400 });
  }
  const m = await db.matiere.create({ data: { ueId, nomMatiere } });
  return NextResponse.json({ matiere: m });
}
