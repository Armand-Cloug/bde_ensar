// src/app/(game)/layout.tsx
import type { ReactNode } from "react";
import Header from "@/components/Header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="content" className="flex-1 pt-14">{children}</main>
      {/* ⚠️ Si tu vois deux footers, supprime cette ligne OU supprime le Footer du root */}
    </>
  );
}
