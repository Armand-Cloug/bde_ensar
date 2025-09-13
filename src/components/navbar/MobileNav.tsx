// src/components/navbar/MobileNav.tsx
'use client';

import { AlignJustify } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';


import Link from 'next/link';
import Image from 'next/image';

export default function MobileNav() {
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

  const linkClass = (href: string) =>
    `block px-3 py-2 ${
      isActive(href)
        ? 'bg-orange-400 text-white font-semibold' // carré orange actif
        : 'text-muted-foreground hover:bg-orange-100 hover:text-foreground'
    }`;

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger aria-label="Ouvrir le menu">
          <AlignJustify />
        </SheetTrigger>

        <SheetContent side="left" className="w-72">
          <Link href="/" className="inline-flex">
            <Image src="/Logo_BDE_1.png" alt="Logo BDE ENSAR" width={50} height={50} />
          </Link>

          <nav className="flex flex-col gap-2 mt-6">
            <SheetClose asChild>
              <Link className={linkClass('/')} href="/">Accueil</Link>
            </SheetClose>

            <SheetClose asChild>
              <Link className={linkClass('/apropos')} href="/apropos">À propos</Link>
            </SheetClose>

            <SheetClose asChild>
              <Link className={linkClass('/event')} href="/event">Événement</Link>
            </SheetClose>

            <SheetClose asChild>
              <Link className={linkClass('/gallerie')} href="/gallerie">Galerie</Link>
            </SheetClose>

            <SheetClose asChild>
              <Link className={linkClass('/statuts')} href="/statuts">Status</Link>
            </SheetClose>
            {/* Anal : admin OU (connecté & adherent) */}
            {(isAdmin || (isAuth && isAdherent)) && (
              <SheetClose asChild>
                <Link className={linkClass('/anal')} href="/anal">Cours</Link>
              </SheetClose>
            )}

            {/* Adhésion : admin OU (non connecté) OU (connecté & non-adherent) */}
            {(isAdmin || !isAuth || (isAuth && !isAdherent)) && (
              <SheetClose asChild>
                <Link className={linkClass('/adhesion')} href="/adhesion">Adhésion</Link>
              </SheetClose>
            )}

            <SheetClose asChild>
              <Link className={linkClass('/contact')} href="/contact">Contact</Link>
            </SheetClose>

            {/* Compte / Connexion */}
            {status === 'loading' ? null : isAuth ? (
              <SheetClose asChild>
                <Link className={linkClass('/account')} href="/account">Mon compte</Link>
              </SheetClose>
            ) : (
              <SheetClose asChild>
                <Link className={linkClass('/sign-in')} href="/sign-in">Connexion</Link>
              </SheetClose>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
