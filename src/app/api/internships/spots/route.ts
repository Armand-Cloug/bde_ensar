// src/app/api/internships/spots/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import * as z from "zod";

const SpotSchema = z.object({
  title: z.string().min(2),
  companyName: z.string().min(2),
  address: z.string().min(3),
  city: z.string().optional(),
  countryCode: z.string().length(2),
  countryName: z.string().optional(),
  lat: z.number().finite(),
  lng: z.number().finite(),
  contactEmail: z.string().email().optional(),
  website: z.string().url().optional(),
  description: z.string().max(2000).optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const country = searchParams.get("countryCode") ?? "";
  const onlyApproved = (searchParams.get("approved") ?? "1") !== "0";

  const where: any = {
    ...(onlyApproved ? { approved: true } : {}),
    ...(country ? { countryCode: country } : {}),
    ...(q
      ? {
          OR: [
            { companyName: { contains: q, mode: "insensitive" } },
            { title:       { contains: q, mode: "insensitive" } },
            { city:        { contains: q, mode: "insensitive" } },
            { countryName: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const spots = await db.internshipSpot.findMany({
    where,
    select: {
      id: true,
      title: true,
      companyName: true,
      address: true,
      city: true,
      countryCode: true,
      countryName: true,
      lat: true,
      lng: true,
      website: true,
      contactEmail: true,
      description: true,
      approved: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ spots });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = (session.user as any).role;
  if (role !== "admin" && role !== "bde") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const data = SpotSchema.parse(body);

  const created = await db.internshipSpot.create({
    data: {
      ...data,
      createdBy: String(session.user.id),
      approved: false, // le BDE/ADMIN pourra valider ensuite
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
}
