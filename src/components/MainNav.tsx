import Link from "next/link";
import Image from 'next/image';

export default function MainNav() {
    return (
        <div className="hidden md:flex"> 
            <Link href="/">
                <Image src="/Logo_BDE_1.png" alt="Logo" width={50} height={50} />
            </Link>
            <nav className="flex items-center gap-3 lg:gap-4 ml-8">
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
        </div>
    )
}