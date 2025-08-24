// app/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/providers/SessionProvider";
import { Geist, Geist_Mono } from "next/font/google";
import { TailwindIndicator } from "@/components/Tailwind-indicator";
import { Toaster } from "@/components/ui/toaster";

// ⬇️ NEW
import PingHousekeeping from "@/components/PingHousekeeping";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BDE Ensar",
  description: "Dev by Cloug",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh h-full flex flex-col overflow-x-hidden`}
      >
        <AuthProvider>
          {/* Header sticky (56px) */}
          <Header />

          {/* ⬇️ NEW: ping une fois/jour pour lancer le sweep inactivité */}
          <PingHousekeeping />

          {/* Décalage sous le header pour éviter qu'il recouvre le contenu */}
          <main id="content" className="flex-1 pt-14">
            {children}
          </main>

          {/* Footer orange */}
          <Footer />

          {/* Utils */}
          <TailwindIndicator />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
