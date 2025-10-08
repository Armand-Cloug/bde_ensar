// src/components/navbar/MainNav.tsx
'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // si tu as un utilitaire cn, sinon supprime et fais une concat simple

import Link from 'next/link';
import Image from 'next/image';

export default function MainNav() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isAuth = status === 'authenticated';
  const role = (session?.user as any)?.role;
  const isAdmin = role === 'admin';
  const isAdherent = Boolean((session?.user as any)?.isAdherent);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // petite classe de lien avec la barre orange
  const linkClass = (href: string) =>
    cn(
      'relative px-1 py-1 transition-colors',
      // couleur de texte active optionnelle
      isActive(href) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
      // barre orange animée
      'after:absolute after:left-0 after:-bottom-2 after:h-0.5 after:w-full after:origin-left after:rounded-full after:bg-amber-400',
      isActive(href) ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100',
      'after:transition-transform after:duration-300'
    );

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

      {/* pb-2 pour laisser la place au soulignement */}
      <nav className="flex items-center gap-3 lg:gap-4 ml-8 pb-2">
        <Link className={linkClass('/')} href="/">Accueil</Link>
        <Link className={linkClass('/apropos')} href="/apropos">À propos</Link>
        <Link className={linkClass('/event')} href="/event">Événement</Link>
        <Link className={linkClass('/gallerie')} href="/gallerie">Galerie</Link>
        <Link className={linkClass('/statuts')} href="/statuts">Status</Link>
        <Link className={linkClass('/stages')} href="/stages">Stages</Link>

        {/* Anal : admin OU (connecté & adherent) */}
        {(isAdmin || (isAuth && isAdherent)) && (
          <Link className={linkClass('/anal')} href="/anal">Cours</Link>
        )}

        {/* Adhésion : admin OU (non connecté) OU (connecté & non-adherent) */}
        {(isAdmin || !isAuth || (isAuth && !isAdherent)) && (
          <Link className={linkClass('/adhesion')} href="/adhesion">Adhésion</Link>
        )}

        <Link className={linkClass('/contact')} href="/contact">Contact</Link>

        {/* Compte / Connexion */}
        {status === 'loading' ? null : isAuth ? (
          <Link className={linkClass('/account')} href="/account">Mon compte</Link>
        ) : (
          <Link className={linkClass('/sign-in')} href="/sign-in">Connexion</Link>
        )}
      </nav>
    </div>
  );
}
