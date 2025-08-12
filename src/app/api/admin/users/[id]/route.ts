import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import * as z from "zod";

const UpdateSchema = z.object({
  firstName:   z.string().min(1).max(100).optional(),
  lastName:    z.string().min(1).max(100).optional(),
  role:        z.enum(["admin", "utilisateur"]).optional(),
  isAdherent:  z.boolean().optional(),
  isAlumni:    z.boolean().optional(),
  promotion:   z.string().max(100).optional().nullable(),
  birthdate:   z.string().datetime().optional().nullable(), // ISO string
  company:     z.string().max(150).optional().nullable(),
}).refine((data) => Object.keys(data).length > 0, { message: "No fields to update" });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }>}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data: any = { ...parsed.data };
  if (data.birthdate !== undefined) {
    data.birthdate = data.birthdate ? new Date(data.birthdate) : null;
  }

  await db.user.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }>}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // (optionnel) empêcher la suppression de soi-même
  // if (session.user.id === id) return NextResponse.json({ error: "Cannot delete self" }, { status: 400 });

  await db.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
