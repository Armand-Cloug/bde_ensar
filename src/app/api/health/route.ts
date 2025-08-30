// src/app/api/health/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // important si tu utilises des libs Node
export async function GET() {
  return NextResponse.json({ ok: true });
}
