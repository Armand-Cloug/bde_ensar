'use client';

import MainNav from "./navbar/MainNav";
import MobileNav from "./navbar/MobileNav";
import Link from "next/link";
import { Instagram, Lock } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const isAdmin = (session?.user as any)?.role === "admin";

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50
        border-b bg-background/80 backdrop-blur
        supports-[backdrop-filter]:bg-background/60
      "
    >
      <div className="h-14 flex items-center justify-between px-4 bg-gradient-to-b from-orange-50 via-orange-100 to-orange-150 border border-orange-200/60">
        {/* Gauche */}
        <div className="flex items-center gap-4">
          <MainNav />
          <MobileNav />
        </div>

        {/* Droite */}
        <div className="flex items-center gap-4">
          <Link
            href="https://www.instagram.com/bde_ensar"
            target="_blank"
            aria-label="Instagram du BDE"
            title="Instagram du BDE"
          >
            <Instagram />
          </Link>

          {/* Lien Admin visible uniquement pour les admins */}
          {status === "authenticated" && isAdmin && (
            <Link href="/admin" aria-label="Espace admin" title="Espace admin">
              <Lock />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
