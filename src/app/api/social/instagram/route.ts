import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type IgPost = {
  id: string;
  caption?: string | null;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | string;
  media_url?: string | null;
  thumbnail_url?: string | null;
  permalink: string;
  timestamp?: string;
};

function ok<T>(data: T, seconds = 600) {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": `s-maxage=${seconds}, stale-while-revalidate=3600`,
    },
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, Math.min(10, Number(searchParams.get("limit") ?? 5)));

    // --- 1) Basic Display API (graph.instagram.com/me/media) ---
    const basicToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (basicToken) {
      const url = new URL("https://graph.instagram.com/me/media");
      url.searchParams.set(
        "fields",
        "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp"
      );
      url.searchParams.set("access_token", basicToken);
      url.searchParams.set("limit", String(limit));

      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) throw new Error("instagram basic display error");
      const json = await res.json();

      const items: IgPost[] = (json?.data ?? []).map((p: any) => ({
        id: String(p.id),
        caption: p.caption ?? null,
        media_type: p.media_type,
        media_url: p.media_url ?? null,
        thumbnail_url: p.thumbnail_url ?? null,
        permalink: p.permalink,
        timestamp: p.timestamp ?? null,
      }));

      return ok({ items });
    }

    // --- 2) Graph API (business) : https://graph.facebook.com/v19.0/{ig-user-id}/media ---
    const igUserId = process.env.INSTAGRAM_IG_USER_ID;
    const graphToken = process.env.INSTAGRAM_GRAPH_TOKEN;
    if (igUserId && graphToken) {
      const url = new URL(`https://graph.facebook.com/v19.0/${igUserId}/media`);
      url.searchParams.set(
        "fields",
        "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp"
      );
      url.searchParams.set("access_token", graphToken);
      url.searchParams.set("limit", String(limit));

      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) throw new Error("instagram graph api error");
      const json = await res.json();

      const items: IgPost[] = (json?.data ?? []).map((p: any) => ({
        id: String(p.id),
        caption: p.caption ?? null,
        media_type: p.media_type,
        media_url: p.media_url ?? null,
        thumbnail_url: p.thumbnail_url ?? null,
        permalink: p.permalink,
        timestamp: p.timestamp ?? null,
      }));

      return ok({ items });
    }

    // Aucun token configuré → vide (fallback)
    return ok({ items: [] }, 60);
  } catch (e) {
    // En cas d’erreur, renvoyer un payload vide (on garde l’UI vivante)
    return ok({ items: [] }, 60);
  }
}
