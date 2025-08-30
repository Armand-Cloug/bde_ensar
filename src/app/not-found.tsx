// src/app/not-found.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchX, Home, CalendarDays, Mail } from "lucide-react";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="px-4 py-14 md:py-16 max-w-5xl mx-auto space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 text-white shadow">
        {/* Décor subtil */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-56 w-56 rounded-full bg-black/10 blur-2xl" />

        <div className="relative grid gap-6 p-8 md:p-12 md:grid-cols-[1.2fr,0.8fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur">
              <SearchX className="h-4 w-4" />
              Erreur 404
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
              Oups… cette page est introuvable
            </h1>
            <p className="mt-3 text-white/90 max-w-2xl">
              Le lien a peut-être changé, a expiré ou n’existe pas. Pas de panique :
              voici quelques raccourcis utiles pour continuer ta visite.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="secondary" className="text-orange-700">
                <Link href="/"><Home className="mr-2 h-4 w-4" /> Retour à l’accueil</Link>
              </Button>
              <Button asChild className="bg-black/20 hover:bg-black/30">
                <Link href="/event"><CalendarDays className="mr-2 h-4 w-4" /> Événements</Link>
              </Button>
              <Button asChild className="bg-black/20 hover:bg-black/30">
                <Link href="/contact"><Mail className="mr-2 h-4 w-4" /> Contact</Link>
              </Button>
            </div>
          </div>

          {/* Bloc 404 visuel */}
          <div className="grid place-items-center">
            <div className="rounded-2xl bg-white/15 px-10 py-8 backdrop-blur shadow">
              <span className="block text-6xl md:text-7xl font-extrabold tracking-tight">
                404
              </span>
              <span className="mt-1 block text-sm text-white/85">
                Page non trouvée
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Suggestions */}
      <section>
        <Card className="border-muted/60">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              Où veux-tu aller ?
            </h2>
            <ul className="grid gap-3 text-muted-foreground md:grid-cols-2">
              <li className="rounded-lg border border-dashed p-3">
                <Link href="/" className="hover:text-orange-600 hover:underline">
                  Accueil du site
                </Link>
              </li>
              <li className="rounded-lg border border-dashed p-3">
                <Link href="/apropos" className="hover:text-orange-600 hover:underline">
                  À propos du BDE
                </Link>
              </li>
              <li className="rounded-lg border border-dashed p-3">
                <Link href="/event" className="hover:text-orange-600 hover:underline">
                  Tous les événements
                </Link>
              </li>
              <li className="rounded-lg border border-dashed p-3">
                <Link href="/contact" className="hover:text-orange-600 hover:underline">
                  Nous contacter
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
