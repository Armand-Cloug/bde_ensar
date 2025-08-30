// src/app/api/account/update/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json();

  const data: any = {};
  if (typeof json.firstName !== "undefined") data.firstName = json.firstName || null;
  if (typeof json.lastName  !== "undefined") data.lastName  = json.lastName  || null;
  if (typeof json.promotion !== "undefined") data.promotion = json.promotion || null;
  if (typeof json.company   !== "undefined") data.company   = json.company   || null; // ✅
  if (typeof json.birthdate !== "undefined") {
    data.birthdate = json.birthdate ? new Date(json.birthdate) : null;
  }

  if (!Object.keys(data).length) {
    return NextResponse.json({ error: "No changes" }, { status: 400 });
  }

  await db.user.update({
    where: { id: String(session.user.id) },
    data,
  });

  return NextResponse.json({ ok: true });
}
