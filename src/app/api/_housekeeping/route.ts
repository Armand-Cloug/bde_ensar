import { NextResponse } from "next/server";
import { maybeRunInactivitySweep } from "@/lib/housekeeping";

export async function GET() {
  // Fire-and-forget ; ne renvoie rien d’exposé
  maybeRunInactivitySweep().catch(() => {});
  return new NextResponse(null, { status: 204 });
}
