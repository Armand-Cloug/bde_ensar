// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? 15)));

  const where = q
    ? { name: { contains: q, mode: "insensitive" as const } }
    : {};

  const [total, items] = await Promise.all([
    db.partner.count({ where }),
    db.partner.findMany({
      where,
      orderBy: [{ order: "asc" }, { name: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: { id: true, name: true, website: true, active: true, order: true, logoUrl: true },
    }),
  ]);

  return NextResponse.json({ total, partners: items });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, logoUrl, website, description, order, active } = body ?? {};
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const created = await db.partner.create({
    data: {
      name,
      logoUrl: logoUrl ?? null,
      website: website ?? null,
      description: description ?? null,
      order: Number.isFinite(order) ? Number(order) : 0,
      active: typeof active === "boolean" ? active : true,
    },
  });
  return NextResponse.json({ partner: created }, { status: 201 });
}
