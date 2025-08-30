// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TailwindIndicator } from "@/components/Tailwind-indicator";
import { Toaster } from "@/components/ui/toaster";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/providers/SessionProvider";
import PingHousekeeping from "@/components/PingHousekeeping";

import "@/styles/globals.css";

const siteUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BDE ENSAR — Campus de Niort",
    template: "%s — BDE ENSAR",
  },
  description:
    "Vie associative de l’ENSAR (Université de Poitiers) — Campus de Niort : événements, adhésions, réseau des alumnis, entraide et infos pratiques.",
  metadataBase: new URL(siteUrl),

  keywords: [
    "BDE ENSAR",
    "ENSAR",
    "Université de Poitiers",
    "Campus de Niort",
    "association étudiante",
    "événements étudiants",
    "adhésion",
    "alumnis",
    "vie étudiante",
  ],
  authors: [
    { name: "BDE ENSAR" },
    { name: "Cloug", url: "https://github.com/Armand-Cloug" },
  ],
  creator: "BDE ENSAR",
  publisher: "BDE ENSAR",
  applicationName: "BDE ENSAR",

  alternates: {
    canonical: "/",
    languages: { "fr-FR": "/" },
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "BDE ENSAR",
    title: "BDE ENSAR — Campus de Niort",
    description:
      "Rejoins la vie associative de l’ENSAR à Niort : événements, adhésions, réseau et entraide.",
    locale: "fr_FR",
    images: [
      {
        url: "/og-cover.jpg", // 1200x630 conseillé (mets ce fichier dans /public)
        width: 1200,
        height: 630,
        alt: "BDE ENSAR — Campus de Niort",
      },
    ],
  },

  // Pas de handle X/Twitter pour éviter les placeholders.
  twitter: {
    card: "summary_large_image",
    title: "BDE ENSAR — Campus de Niort",
    description:
      "Vie associative, événements et réseau des étudiants ENSAR (Université de Poitiers) — Campus de Niort.",
    images: ["/og-cover.jpg"],
  },

  icons: {
    icon: [
      { url: "/favicon.png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: ["/favicon.png"],
  },
  manifest: "/site.webmanifest",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  // Réseaux connus (gérés côté pages) : Instagram @bde_ensar
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f97316",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh h-full flex flex-col overflow-x-hidden`}
      >
        <AuthProvider>
          <Header />
          <PingHousekeeping />
          <main id="content" className="flex-1 pt-14">
            {children}
          </main>
          <Footer />
          <TailwindIndicator />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
