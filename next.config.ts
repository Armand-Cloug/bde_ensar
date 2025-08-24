import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Indispensable pour l’image Docker “runtime” légère
  output: "standalone",

  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Images distantes (assoupli par défaut ; resserre si tu veux)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },

  // Évite que le build échoue sur des warnings ESLint en CI
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Laisse à true par défaut pour éviter des surprises en prod
  typescript: {
    ignoreBuildErrors: false,
  },

  // Quelques headers de base — n’ajoute une CSP stricte qu’après test
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  // Exemple si tu as un monorepo : décommente et adapte
  // outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
