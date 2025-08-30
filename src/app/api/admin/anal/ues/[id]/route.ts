// src/app/api/admin/anal/ues/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ueNumber, nomUe } = await req.json();
  if (!ueNumber) {
    return NextResponse.json({ error: "ueNumber requis" }, { status: 400 });
  }

  await db.ue.update({
    where: { id },
    data: {
      ueNumber: Number(ueNumber),
      nomUe: nomUe ?? null,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await db.ue.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
