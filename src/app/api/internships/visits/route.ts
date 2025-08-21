// app/api/internships/visits/route.ts
import { NextResponse } from "next/server";
import * as z from "zod";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const VisitSchema = z.object({
  spotId: z.string().min(1),
  year: z.number().int().min(2000).max(new Date().getFullYear() + 1).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().max(2000).optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data = VisitSchema.parse(body);

  await db.internshipVisit.create({
    data: {
      ...data,
      userId: String(session.user.id),
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
