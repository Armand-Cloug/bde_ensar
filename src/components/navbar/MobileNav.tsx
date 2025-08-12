'use client';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { AlignJustify } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function MobileNav() {
  const { data: session, status } = useSession();

  const isAuth = status === 'authenticated';
  const role = (session?.user as any)?.role;
  const isAdmin = role === 'admin';
  const isAdherent = Boolean((session?.user as any)?.isAdherent);

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

          <nav className="flex flex-col gap-3 mt-6">
            <SheetClose asChild>
              <Link href="/">Accueil</Link>
            </SheetClose>

            <SheetClose asChild>
              <Link href="/apropos">À propos</Link>
            </SheetClose>

            <SheetClose asChild>
              <Link href="/event">Événement</Link>
            </SheetClose>

            <SheetClose asChild>
              <Link href="/gallerie">Galerie</Link>
            </SheetClose>

            {/* Anal : admin OU (connecté & adherent) */}
            {(isAdmin || (isAuth && isAdherent)) && (
              <SheetClose asChild>
                <Link href="/anal">Anal</Link>
              </SheetClose>
            )}

            {/* Adhésion : admin OU (non connecté) OU (connecté & non-adherent) */}
            {(isAdmin || !isAuth || (isAuth && !isAdherent)) && (
              <SheetClose asChild>
                <Link href="/adhesion">Adhésion</Link>
              </SheetClose>
            )}

            <SheetClose asChild>
              <Link href="/contact">Contact</Link>
            </SheetClose>

            {/* Compte / Connexion */}
            {status === 'loading' ? null : isAuth ? (
              <SheetClose asChild>
                <Link href="/account">Mon compte</Link>
              </SheetClose>
            ) : (
              <SheetClose asChild>
                <Link href="/sign-in">Connexion</Link>
              </SheetClose>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
