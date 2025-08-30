// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const q        = (searchParams.get("q") ?? "").trim();
  const page     = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? "10")));
  const skip     = (page - 1) * pageSize;
  const take     = pageSize;

  // ⚠️ Pas de "mode: 'insensitive'" ici pour compatibilité maximale (SQLite etc.)
  const where = q
    ? {
        OR: [
          { firstName: { contains: q } },
          { lastName:  { contains: q } },
          { email:     { contains: q } },
        ],
      }
    : {};

  const [total, users] = await Promise.all([
    db.user.count({ where }),   // ✅ count() n'accepte pas "select"
    db.user.findMany({
      where,
      select: { id: true, firstName: true, lastName: true, email: true },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      skip,
      take,
    }),
  ]);

  return NextResponse.json({
    users: users.map((u: any) => ({ ...u, id: String(u.id) })),
    total,
    page,
    pageSize: take,
  });
}
