// app/api/admin/alumni/requests/route.ts
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

  const where = {
    statut: "en_attente" as const,
    ...(q
      ? {
          OR: [
            { diplome: { contains: q } },
            { user: { firstName: { contains: q } } },
            { user: { lastName: { contains: q } } },
            { user: { email: { contains: q } } },
          ],
        }
      : {}),
  };

  const [total, requests] = await Promise.all([
    db.alumniRequest.count({ where }),
    db.alumniRequest.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        diplome: true,
        anneeObtention: true,
        statut: true,
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    }),
  ]);

  const rows = requests.map((r: any) => ({
    id: String(r.id),
    userId: String(r.user.id),
    firstName: r.user.firstName,
    lastName: r.user.lastName,
    email: r.user.email,
    diplome: r.diplome,
    annee: r.anneeObtention,
    statut: r.statut,
  }));

  return NextResponse.json({ total, requests: rows });
}
