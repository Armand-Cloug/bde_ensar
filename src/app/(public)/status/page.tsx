// src/app/(public)/coming-soon/page.tsx
import { Rocket, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <main className="px-4 py-10 md:py-14 max-w-6xl mx-auto space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 text-white shadow">
        {/* décor léger */}
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-52 w-52 rounded-full bg-black/10 blur-2xl" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 p-8 md:p-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur">
            <Sparkles className="h-4 w-4" /> En cours de construction
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Bientôt disponible
            </h1>
            <p className="mt-3 text-white/90 max-w-2xl">
              Cette page et ses fonctionnalités arrivent très bientôt.
              Nous peaufinons les derniers détails pour te proposer
              une expérience aux petits oignons 🌶️.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="secondary" className="text-orange-600">
                <Link href="/">Retour à l’accueil</Link>
              </Button>
              <Button asChild className="bg-black/20 hover:bg-black/30">
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>

          <div className="shrink-0 self-center md:self-auto">
            <div className="grid place-items-center rounded-2xl bg-white/15 p-5 backdrop-blur">
              <Rocket className="h-14 w-14" />
            </div>
          </div>
        </div>
      </section>

      {/* Détails / Roadmap */}
      <section>
        <Card className="border-muted/60">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-orange-600" />
              <h2 className="text-xl md:text-2xl font-semibold">
                Ce qui arrive prochainement
              </h2>
            </div>

            <ul className="grid gap-3 text-muted-foreground md:grid-cols-2">
              <li className="rounded-lg border border-dashed p-3">
                ✔️ Les status du BDE
              </li>
              <li className="rounded-lg border border-dashed p-3">
                ✔️ Le règlement du BDE
              </li>
              <li className="rounded-lg border border-dashed p-3">
                ✔️ D'autres info administratives du BDE
              </li>
            </ul>

            <p className="mt-6 text-sm text-muted-foreground">
              Besoin d’une info en attendant ? —
              <Link href="/contact" className="ml-1 font-medium text-orange-600 hover:underline">
                écris-nous, on répond vite.
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
