import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  // On ne révèle pas si l'email existe (anti enumeration)
  const user = await db.user.findUnique({ where: { email } }).catch(() => null);
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  // supprimer anciens tokens
  await db.verificationToken.deleteMany({ where: { identifier: email } }).catch(() => {});

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h

  await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = `${base}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  await sendMail({
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    html: `
      <p>Bonjour,</p>
      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
      <p>Veuillez cliquer sur le lien ci-dessous (valable 1 heure) :</p>
      <p><a href="${url}">${url}</a></p>
      <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
    `,
  });

  return NextResponse.json({ ok: true });
}
