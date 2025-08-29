// app/api/admin/events/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ev = await db.event.findUnique({
    where: { id },
    include: {
      eventPages: {
        select: { id: true, slug: true },
        take: 1,
      },
    },
  });

  if (!ev) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ event: ev });
}

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
  const data: any = {};

  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.location === "string" || body.location === null) {
    data.location = body.location ?? null;
  }
  if (typeof body.inscriptionLink === "string" || body.inscriptionLink === null) {
    data.inscriptionLink = body.inscriptionLink ?? null;
  }
  if (typeof body.image === "string" || body.image === null) {
    data.image = body.image ?? null;
  }
  if (typeof body.isActive === "boolean") data.isActive = body.isActive;
  if (typeof body.date === "string") data.date = new Date(body.date);
  if (typeof body.description === "string") data.description = body.description;

  await db.event.update({ where: { id }, data });

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

  await db.event.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
