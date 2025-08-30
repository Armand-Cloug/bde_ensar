// src/lib/housekeeping.ts
import { db } from "@/lib/db";
import { sendMail } from "@/lib/mail";

import os from "node:os";

// petites aides date
const MONTH = 30 * 24 * 60 * 60 * 1000;
const now = () => new Date();
const subMonths = (d: Date, n: number) => new Date(d.getTime() - n * MONTH);

async function acquireLock(key: string, ttlMs = 10 * 60 * 1000) {
  const id = `${os.hostname()}-${process.pid}`;
  const nowD = now();
  const expiredBefore = new Date(nowD.getTime() - ttlMs);

  // upsert + verrou optimiste (si lock trop vieux)
  const row = await db.jobState.upsert({
    where: { key },
    update: {},
    create: { key },
  });

  if (row.lockedAt && row.lockedAt > expiredBefore) return null; // déjà locké

  const updated = await db.jobState.update({
    where: { key },
    data: { lockedAt: nowD, lockedBy: id },
  });

  return { id, updatedAt: updated.lockedAt };
}

async function releaseLock(key: string) {
  await db.jobState.update({
    where: { key },
    data: { lockedAt: null, lockedBy: null, lastRunAt: now() },
  });
}

function appBaseUrl() {
  return (
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export async function maybeRunInactivitySweep() {
  const KEY = "inactivity-sweep";
  const state = await db.jobState.findUnique({ where: { key: KEY } });
  // ne pas relancer si déjà fait depuis < 24h
  if (state?.lastRunAt && now().getTime() - state.lastRunAt.getTime() < 24 * 60 * 60 * 1000) return;

  const lock = await acquireLock(KEY);
  if (!lock) return; // quelqu’un d’autre s’en charge

  try {
    const baseUrl = appBaseUrl();
    const warnBefore = subMonths(now(), 23);
    const deleteBefore = subMonths(now(), 24);

    // 1) Prévenir ceux inactifs depuis 23 mois non avertis
    const toWarn = await db.user.findMany({
      where: {
        lastLoginAt: { lt: warnBefore },
        inactiveWarnedAt: null,
      },
      select: { id: true, email: true, firstName: true },
    });

    for (const u of toWarn) {
      try {
        const link = `${baseUrl}/sign-in`;
        await sendMail({
          to: u.email!,
          subject: "BDE ENSAR — Inactivité de votre compte",
          html: `
            <p>Bonjour ${u.firstName ?? ""},</p>
            <p>Nous n'avons pas constaté d'activité récente sur votre compte BDE ENSAR.</p>
            <p>Sans connexion dans le mois, votre compte sera supprimé automatiquement (RGPD).</p>
            <p>Connectez-vous pour le conserver : <a href="${link}">${link}</a></p>
          `,
        });
        await db.user.update({
          where: { id: u.id },
          data: { inactiveWarnedAt: now() },
        });
      } catch { /* log si besoin */ }
    }

    // 2) Supprimer ceux inactifs depuis 24 mois ET déjà avertis
    const toDelete = await db.user.findMany({
      where: {
        lastLoginAt: { lt: deleteBefore },
        inactiveWarnedAt: { not: null },
      },
      select: { id: true },
    });

    // Ici, supprime les sessions/comptes liés en respectant tes contraintes (FK, soft delete, etc.)
    for (const u of toDelete) {
      try {
        await db.user.delete({ where: { id: u.id } });
      } catch { /* log si besoin */ }
    }
  } finally {
    await releaseLock(KEY);
  }
}
