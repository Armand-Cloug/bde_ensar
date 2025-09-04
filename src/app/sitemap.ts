// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://bde-ensar.fr";

  const now = new Date();

  // Routes publiques "fixes"
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`,            lastModified: now, changeFrequency: "weekly",  priority: 1 },
    { url: `${base}/apropos`,     lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/event`,       lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${base}/gallerie`,    lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${base}/stages`,      lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${base}/adhesion`,    lastModified: now, changeFrequency: "yearly",  priority: 0.5 },
    { url: `${base}/contact`,     lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
  ];

  try {
    // Pages d’événements (uniquement actifs)
    const eventPages = await db.eventPage.findMany({
      where: { event: { isActive: true } },
      select: { slug: true, event: { select: { date: true, createdAt: true } } },
    });

    const eventEntries: MetadataRoute.Sitemap = eventPages.map((p) => ({
      url: `${base}/event/${p.slug}`,
      lastModified: p.event?.date ?? p.event?.createdAt ?? now,
      changeFrequency: "daily",
      priority: 0.8,
    }));

    // Galeries (uniquement actives) – pages liste → /gallerie/[id]
    const galleries = await db.galleryEvent.findMany({
      where: { isActive: true },
      select: { id: true, createdAt: true },
    });

    const galleryEntries: MetadataRoute.Sitemap = galleries.map((g) => ({
      url: `${base}/gallerie/${g.id}`,
      lastModified: g.createdAt ?? now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...staticRoutes, ...eventEntries, ...galleryEntries];
  } catch {
    // En cas d’erreur DB, on retourne au moins les routes statiques
    return staticRoutes;
  }
}
