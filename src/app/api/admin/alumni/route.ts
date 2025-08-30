// src/app/api/admin/alumni/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 15)));

  const skip = (page - 1) * pageSize;

  const where = q
    ? {
        AND: [
          { isAlumni: true },
          {
            OR: [
              { firstName: { contains: q } },
              { lastName: { contains: q } },
              { email: { contains: q } },
            ],
          },
        ],
      }
    : { isAlumni: true };

  const [total, users] = await Promise.all([
    db.user.count({ where }),
    db.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        // on remonte la dernière demande validée pour diplome/année
        alumniRequests: {
          where: { statut: "valide" },
          take: 1,
          orderBy: { createdAt: "desc" },
          select: { diplome: true, anneeObtention: true },
        },
      },
    }),
  ]);

  const alumni = users.map((u: any) => ({
    id: String(u.id),
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    diplome: u.alumniRequests[0]?.diplome ?? null,
    annee: u.alumniRequests[0]?.anneeObtention ?? null,
  }));

  return NextResponse.json({ total, alumni });
}
