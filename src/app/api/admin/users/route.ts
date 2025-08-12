// app/api/admin/users/route.ts
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
  const q = searchParams.get("q")?.trim() ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const take = Math.min(Math.max(pageSize, 1), 100);
  const skip = Math.max((page - 1) * take, 0);

  const where = q
    ? {
        OR: [
          { firstName: { contains: q, mode: "insensitive" } },
          { lastName:  { contains: q, mode: "insensitive" } },
          { email:     { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [ total, users ] = await Promise.all([
    db.user.count({ where }),
    db.user.findMany({
      where,
      select: { id: true, firstName: true, lastName: true, email: true },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      skip,
      take,
    }),
  ]);

  return NextResponse.json({
    users: users.map(u => ({ ...u, id: String(u.id) })), // id en string pour le DataTable
    page,
    pageSize: take,
    total,
  });
}
