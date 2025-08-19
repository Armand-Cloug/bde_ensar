// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";

export const runtime = "nodejs";

const BDE_EMAIL = process.env.BDE_EMAIL || "bde.ensar.contact@gmail.com";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "BDE ENSAR";

export async function POST(req: Request) {
  try {
    const { email, subject, message } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }
    if (!subject || !message) {
      return NextResponse.json({ error: "Objet et message requis" }, { status: 400 });
    }

    // 1) Mail au BDE
    await sendMail({
      to: BDE_EMAIL,
      subject: `[Contact] ${subject}`,
      html: `
        <p><strong>Expéditeur :</strong> ${email}</p>
        <p><strong>Objet :</strong> ${subject}</p>
        <hr/>
        <p style="white-space:pre-line">${escapeHtml(message)}</p>
      `,
    });

    // 2) Accusé de réception au user
    await sendMail({
      to: email,
      subject: `Votre message a bien été reçu – ${APP_NAME}`,
      html: `
        <p>Bonjour,</p>
        <p>Nous avons bien reçu votre message et vous répondrons au plus vite.</p>
        <p><strong>Récapitulatif :</strong></p>
        <p><em>${subject}</em></p>
        <blockquote style="border-left:3px solid #ddd;padding-left:12px;color:#555;">
          ${escapeHtml(message).replace(/\n/g, "<br/>")}
        </blockquote>
        <p>Cordialement,<br/>L'équipe ${APP_NAME}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[CONTACT_API]", e);
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
