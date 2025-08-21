// app/api/internships/spots/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as z from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const PatchSchema = z.object({
  title: z.string().min(2).optional(),
  companyName: z.string().min(2).optional(),
  address: z.string().min(3).optional(),
  city: z.string().optional(),
  countryCode: z.string().length(2).optional(),
  countryName: z.string().optional(),
  lat: z.number().finite().optional(),
  lng: z.number().finite().optional(),
  contactEmail: z.string().email().optional().nullable(),
  website: z.string().url().optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  approved: z.boolean().optional(),
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const spot = await db.internshipSpot.findUnique({
    where: { id: params.id },
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
  });
  if (!spot) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ spot });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any).role;
  if (role !== "admin" && role !== "bde") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const payload = await req.json();
  const data = PatchSchema.parse(payload);

  await db.internshipSpot.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any).role;
  if (role !== "admin" && role !== "bde") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await db.internshipSpot.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
