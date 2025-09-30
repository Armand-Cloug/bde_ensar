// src/app/(public)/layout.tsx
import type { ReactNode } from "react";
import Header from "@/components/Header";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="content" className="flex-1 pt-14">{children}</main>
    </>
  );
}
