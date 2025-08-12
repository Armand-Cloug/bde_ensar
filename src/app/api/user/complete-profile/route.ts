// /app/api/user/complete-profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { firstName, lastName } = await req.json();

  await db.user.update({
    where: { email: session.user.email },
    data: { firstName: firstName, lastName: lastName },
  });

  return NextResponse.json({ ok: true });
}
