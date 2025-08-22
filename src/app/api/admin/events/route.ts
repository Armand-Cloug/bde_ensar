// app/api/admin/events/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? 15)));

  const where = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { location: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [total, items] = await Promise.all([
    db.event.count({ where }),
    db.event.findMany({
      where,
      orderBy: { date: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        title: true,
        date: true,
        location: true,
        isActive: true,
      },
    }),
  ]);

  return NextResponse.json({ total, events: items });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    title,
    date,
    location,
    inscriptionLink,
    image,
    isActive,
    description, // requis
  } = body ?? {};

  if (!title || !date || !description) {
    return NextResponse.json(
      { error: "Title, date and description are required" },
      { status: 400 }
    );
  }

  const created = await db.event.create({
    data: {
      title,
      date: new Date(date),
      location: location ?? null,
      inscriptionLink: inscriptionLink ?? null,
      image: image ?? null,
      isActive: Boolean(isActive),
      description, // sauvegarde
      createdBy: String((session.user as any).id),
    },
    select: { id: true },
  });

  return NextResponse.json({ id: created.id }, { status: 201 });
}
