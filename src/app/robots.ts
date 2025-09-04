// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/apropos",
          "/event",
          "/event/*",
          "/gallerie",
          "/gallerie/*",
          "/stages",
          "/adhesion",
          "/contact",
        ],
        disallow: [
          "/admin",
          "/account",
          "/anal",
          "/api/",
          "/sign-in",
          "/sign-up",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
