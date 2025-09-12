// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const role = (searchParams.get("role") || "").trim(); // ex: "admin"
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const pageSize = Math.min(1000, Math.max(1, Number(searchParams.get("pageSize") || "15")));

  const where: any = {};
  if (q) {
    where.OR = [
      { email: { contains: q } },
      { firstName: { contains: q } },
      { lastName: { contains: q } },
    ];
  }
  if (role) where.role = role; // ← filtre par rôle si fourni

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true, // ← important pour filtrage client éventuel
      },
    }),
    db.user.count({ where }),
  ]);

  return NextResponse.json({ users, total });
}
