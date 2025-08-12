'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { AlignJustify, Apple } from 'lucide-react';
import Link from "next/link";
import Image from 'next/image';
import { useSession } from "next-auth/react";

export default function MobileNav() {
  const { data: session, status } = useSession();

  return (
    <div className='md:hidden'>
      <Sheet>
        <SheetTrigger>
          <AlignJustify />
        </SheetTrigger>
        <SheetContent side='left'>
          <Link href='/'>
            <Image src="/Logo_BDE_1.png" alt="Logo" width={50} height={50} />
          </Link>
          <nav className='flex flex-col gap-3 lg:gap-4 mt-6'>
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
        </SheetContent>
      </Sheet>
    </div>
  );
}