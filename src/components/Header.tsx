import MainNav from "./navbar/MainNav"
import MobileNav from "./navbar/MobileNav"
import Link from "next/link";
import { Instagram } from 'lucide-react';
import { Lock } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 w-full border-b">
            <div className="h-14 container flex items-center"> 
                {/* DESKTOP */}
                <MainNav />

                {/* MOBILE */}
                <MobileNav />

                {/* D&M */}
                <h1 className="flex items-center justify-end flex-1">
                    <Link href="https://www.instagram.com/bde_ensar" target="_blank"> <Instagram /> </Link>
                    <Link href='/admin'> <Lock /> </Link>
                </h1>
            </div>
        </header>   
    )
}