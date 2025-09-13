// src/app/upload/[...path]/route.ts
import { readFile, stat as fsStat } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

/** Répertoire racine autorisé pour la lecture publique */
const PUBLIC_UPLOAD_DIR = path.join(process.cwd(), "public", "upload");

/** Déduit un Content-Type basique en fonction de l’extension */
function contentTypeFromExt(p: string): string {
  const ext = path.extname(p).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

/** Join sécurisé : empêche toute sortie de /public/upload via .. */
function safeResolve(parts: string[]): string | null {
  // Évite les segments vides ou dangereux
  const clean = parts.filter(Boolean);
  if (!clean.length) return null;

  const abs = path.join(PUBLIC_UPLOAD_DIR, ...clean);
  // Doit commencer par PUBLIC_UPLOAD_DIR (anti-traversal)
  if (!abs.startsWith(PUBLIC_UPLOAD_DIR + path.sep)) return null;
  return abs;
}

async function serveFile(
  req: Request,
  parts: string[],
  { headOnly = false }: { headOnly?: boolean } = {}
): Promise<Response> {
  const abs = safeResolve(parts);
  if (!abs) return new Response("Bad path", { status: 400 });

  let st: Awaited<ReturnType<typeof fsStat>>;
  try {
    st = await fsStat(abs);
    if (!st.isFile()) return new Response("Not found", { status: 404 });
  } catch {
    return new Response("Not found", { status: 404 });
  }

  // ETag (simple et efficace)
  const etag = `"${st.size}-${Math.floor(st.mtimeMs)}"`;
  const ifNone = req.headers.get("if-none-match");
  if (ifNone && ifNone === etag) {
    return new Response(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  const ct = contentTypeFromExt(abs);

  if (headOnly) {
    // Pas de body pour HEAD
    return new Response(null, {
      headers: {
        "Content-Type": ct,
        "Content-Length": String(st.size),
        ETag: etag,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": `inline; filename="${path
          .basename(abs)
          .replace(/"/g, "")}"`,
      },
    });
  }

  // Lecture du fichier
  const buf = await readFile(abs);          // Buffer
  const bytes = new Uint8Array(buf);        // ✅ compatible BodyInit

  return new Response(bytes, {
    headers: {
      "Content-Type": ct,
      "Content-Length": String(bytes.byteLength),
      ETag: etag,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename="${path
        .basename(abs)
        .replace(/"/g, "")}"`,
    },
  });
}

// GET /upload/<...path>
export async function GET(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path: parts } = await ctx.params;
  return serveFile(req, parts, { headOnly: false });
}

// HEAD /upload/<...path>
export async function HEAD(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path: parts } = await ctx.params;
  return serveFile(req, parts, { headOnly: true });
}
