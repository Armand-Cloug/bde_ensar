'use client';

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function MainNav() {
  const { data: session, status } = useSession();

  return (
    <div className="hidden md:flex items-center">
      <Link href="/">
        <Image
          src="/Logo_BDE_1.png"
          alt="Logo"
          width={50}
          height={50}
          className="object-contain"
        />
      </Link>

      <nav className="flex items-center gap-3 lg:gap-4 ml-8">
        <Link href="/">Accueil</Link>
        <Link href="/apropos">À propos</Link>
        <Link href="/event">Événement</Link>
        <Link href="/gallerie">Galerie</Link>
        <Link href="/anal">Anal</Link>
        <Link href="/adhesion">Adhésion</Link>
        <Link href="/contact">Contact</Link>

        {/*  Conditionally render account link based on session status */} 
        {status === "loading" ? null : session?.user ? (
          <Link href="/account">Mon compte</Link>
        ) : (
          <Link href="/sign-in">Connexion</Link>
        )}
      </nav>
    </div>
  );
}
