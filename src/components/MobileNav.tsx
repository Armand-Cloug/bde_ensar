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

export default function MobileNav() {
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
            <Link href="/"> Accueil </Link>
            <Link href="/"> A Propos </Link>
            <Link href="/"> Evenement </Link>  
            <Link href="/"> Galerie </Link>
            <Link href="/"> Anal </Link>
            <Link href="/"> Adhésion </Link>  
            <Link href="/"> Contact </Link>  
            <Link href="/"> Mon Compte </Link>   
            <Link href="/sign-in"> Connexion </Link> 
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}