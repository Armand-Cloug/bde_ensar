// src/app/api/admin/partners/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, logoUrl, website, description, order, active } = body ?? {};

  const updated = await db.partner.update({
    where: { id },
    data: {
      name,
      logoUrl,
      website,
      description,
      order: Number.isFinite(order) ? Number(order) : undefined,
      active: typeof active === "boolean" ? active : undefined,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: updated.id });
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

  await db.partner.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
