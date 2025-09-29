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
        <Link className={linkClass('/quizz')} href="/game-menu">Jeux</Link>
        <Link className={linkClass('/leaderboard')} href="/leaderboard">Classement</Link>
        <Link className={linkClass('/profil')} href="/profil">Mon Profil</Link>
      </nav>
    </div>
  );
}
