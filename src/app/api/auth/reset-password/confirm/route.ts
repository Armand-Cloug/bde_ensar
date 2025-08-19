import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  const { token, email, password } = await req.json();

  if (!token || !email || typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const record = await db.verificationToken.findFirst({
    where: { identifier: email, token },
  });

  if (!record || record.expires < new Date()) {
    return NextResponse.json({ error: "Lien invalide ou expiré" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    // nettoyer le token tout de même
    await db.verificationToken.deleteMany({ where: { identifier: email } });
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const hashed = await hash(password, 10);
  await db.user.update({
    where: { email },
    data: { password: hashed },
  });

  // supprimer tous les tokens restants pour cet email
  await db.verificationToken.deleteMany({ where: { identifier: email } });

  return NextResponse.json({ ok: true });
}
