// src/lib/mail.ts
import nodemailer from "nodemailer";

export async function sendMail(opts: { to: string; subject: string; html: string }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "no-reply@example.com",
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
}
