// src/app/api/_housekeeping/route.ts
import { NextResponse } from "next/server";
import { maybeRunInactivitySweep } from "@/lib/housekeeping";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

let lastRun = 0; // throttle mémoire (optionnel)

export async function GET() {
  const now = Date.now();
  // 30s de throttle local pour éviter du spam si l'UI ping plusieurs fois
  if (now - lastRun > 30_000) {
    lastRun = now;
    // Fire-and-forget : la fonction gère déjà son propre verrou en base
    maybeRunInactivitySweep().catch(() => {});
  }
  // 204 = silencieux, pas de body
  return new NextResponse(null, { status: 204 });
}
