// app/event/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';

import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function fmtDate(d: Date | string) { /* ... inchangé ... */ }

export default async function EventsIndexPage() {
  noStore(); // ✅ pas de prerender/ISR, fetch à la demande (runtime)

  const now = new Date();

  const events = await db.event.findMany({
    where: { isActive: true, date: { gte: now } },
    orderBy: { date: "asc" },
    include: { eventPages: { select: { slug: true }, take: 1 } },
  });

  return (
    <main className="relative px-4 md:px-6 max-w-6xl mx-auto py-10 md:py-14 space-y-8">
      {/* Décor doux */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-20 h-[320px] w-[320px] rounded-full bg-orange-200/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-10 h-[280px] w-[280px] rounded-full bg-amber-200/40 blur-3xl" />

      <header className="space-y-2">
        <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 border-orange-100">
          Événements
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Prochains <span className="text-orange-600">événements</span>
        </h1>
        <p className="text-muted-foreground">
          Retrouvez ici les événements actifs et à venir : titre, date, lieu, lien d’inscription et description.
        </p>
      </header>

      {events.length === 0 ? (
        <p className="text-muted-foreground">Aucun événement actif pour le moment.</p>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev: any) => {
            const slug = ev.eventPages[0]?.slug || null;
            return (
              <Card key={ev.id} className="overflow-hidden border">
                {/* Image (si fournie) */}
                {ev.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-amber-100 to-orange-50" />
                )}

                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2">{ev.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <div><span className="font-medium text-foreground">Date :</span> {fmtDate(ev.date)}</div>
                    {ev.location && (
                      <div><span className="font-medium text-foreground">Lieu :</span> {ev.location}</div>
                    )}
                  </div>

                  {ev.inscriptionLink && (
                    <div>
                      <a
                        href={ev.inscriptionLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center justify-center rounded-md bg-amber-500 px-3 text-white text-sm font-medium hover:bg-amber-600"
                      >
                        S’inscrire
                      </a>
                    </div>
                  )}

                  {ev.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {ev.description}
                    </p>
                  )}

                  <div className="pt-2">
                    {slug ? (
                      <Link href={`/event/${slug}`}>
                        <Button variant="outline" className="border-amber-200 hover:bg-amber-50">
                          Voir la page
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" disabled>
                        Page à venir
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}
    </main>
  );
}
