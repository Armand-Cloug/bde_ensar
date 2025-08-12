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
    <header className="sticky top-0 w-full border-b">
      <div className="h-14 flex items-center justify-between px-4">
        {/* Gauche */}
        <div className="flex items-center gap-4">
          <MainNav />
          <MobileNav />
        </div>

        {/* Droite */}
        <div className="flex items-center gap-4">
          <Link href="https://www.instagram.com/bde_ensar" target="_blank">
            <Instagram />
          </Link>

          {/* Lien Admin visible uniquement pour les admins */}
          {status === "authenticated" && isAdmin && (
            <Link href="/admin">
              <Lock />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
