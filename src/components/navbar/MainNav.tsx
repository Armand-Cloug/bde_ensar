'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function MainNav() {
  const { data: session, status } = useSession();

  const isAuth = status === 'authenticated';
  const role = (session?.user as any)?.role;
  const isAdmin = role === 'admin';
  const isAdherent = Boolean((session?.user as any)?.isAdherent);

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

        {/* Anal : admin OU (connecté & adherent) */}
        {(isAdmin || (isAuth && isAdherent)) && <Link href="/anal">Anal</Link>}

        {/* Adhésion : admin OU (non connecté) OU (connecté & non-adherent) */}
        {(isAdmin || !isAuth || (isAuth && !isAdherent)) && (
          <Link href="/adhesion">Adhésion</Link>
        )}

        <Link href="/contact">Contact</Link>

        {/* Compte / Connexion */}
        {status === 'loading' ? null : isAuth ? (
          <Link href="/account">Mon compte</Link>
        ) : (
          <Link href="/sign-in">Connexion</Link>
        )}
      </nav>
    </div>
  );
}
