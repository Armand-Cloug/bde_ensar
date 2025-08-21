// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-orange-500 text-white">
      <div className="max-w-6xl mx-auto w-full px-4 py-4 md:py-4"> {/* ⬅️ md:py-8 -> md:py-2 */}
        {/* Liens */}
        <nav aria-label="Liens de bas de page">
          <ul className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-center md:gap-6"> {/* ⬅️ md:gap-8 -> md:gap-6 */}
            <li>
              <Link href="/mentions-legales" className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/donnees-personnelles" className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded">
                Données personnelles
              </Link>
            </li>
            <li>
              <Link href="/accessibilite" className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded">
                Accessibilité
              </Link>
            </li>
            <li>
              <Link href="/plan-du-site" className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded">
                Plan du site
              </Link>
            </li>
          </ul>
        </nav>

        {/* Séparateur */}
        <div className="mt-4 md:mt-3 border-t border-white/20" /> {/* ⬅️ mt-6 -> mt-4/md:mt-3 */}

        {/* Copyright */}
        <p className="mt-3 md:mt-2 text-xs md:text-sm text-white/90 text-center"> {/* ⬅️ mt-4 -> mt-3/md:mt-2 */}
          © {year} BDE ENSAR — Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
