// src/app/api/admin/anal/tree/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formations = await db.formation.findMany({
    orderBy: { nom: 'asc' },
    include: {
      semestres: {
        orderBy: { semestre: 'asc' },
        include: {
          ues: {
            orderBy: { ueNumber: 'asc' },
            include: {
              matieres: {
                orderBy: { nomMatiere: 'asc' },
                include: {
                  cours: {
                    orderBy: { createdAt: 'desc' },
                    select: { id: true, title: true, description: true, filePath: true, createdAt: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ formations });
}
