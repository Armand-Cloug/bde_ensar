import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/Header";
import AuthProvider from "@/providers/SessionProvider";
import { Geist, Geist_Mono } from "next/font/google";
import { TailwindIndicator } from "@/components/Tailwind-indicator";
import { Toaster } from "@/components/ui/toaster";

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
          <Header />
          {/* Décalage sous le header (h-14 = 56px) */}
          <main className="flex-1 pt-14">
            {children}
          </main>

          <TailwindIndicator />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
