// app/api/instagram/latest/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const token = process.env.INSTAGRAM_GRAPH_TOKEN; // token “User” IG (business/creator)
  if (!token) {
    return NextResponse.json({ ok: false, posts: [] }); // pas de token => fallback côté UI
  }
  try {
    const url =
      "https://graph.instagram.com/me/media" +
      "?fields=id,media_url,permalink,caption,media_type,thumbnail_url,timestamp" +
      "&limit=9&access_token=" +
      encodeURIComponent(token);

    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();
    const posts =
      Array.isArray(json?.data) ? json.data.filter((p: any) => p.media_url || p.thumbnail_url) : [];

    return NextResponse.json({ ok: true, posts });
  } catch (e) {
    console.error("[INSTAGRAM]", e);
    return NextResponse.json({ ok: false, posts: [] }, { status: 200 });
  }
}
