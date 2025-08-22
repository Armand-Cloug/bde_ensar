// app/event/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

function fmtDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = await db.eventPage.findUnique({
    where: { slug },
    include: { event: true },
  });

  if (!page || !page.event) {
    notFound();
  }

  const ev = page.event;

  return (
    <main className="relative px-4 md:px-6 max-w-5xl mx-auto py-10 md:py-14 space-y-8">
      {/* Décor doux */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-20 h-[320px] w-[320px] rounded-full bg-orange-200/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-10 h-[280px] w-[280px] rounded-full bg-amber-200/40 blur-3xl" />

      {/* Header event */}
      <header className="space-y-2">
        <Link href="/event">
          <Button variant="outline" className="border-amber-200 hover:bg-amber-50">
            ← Tous les événements
          </Button>
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {ev.title}
        </h1>
        <div className="text-muted-foreground">
          <div><span className="font-medium text-foreground">Date :</span> {fmtDate(ev.date)}</div>
          {ev.location && (
            <div><span className="font-medium text-foreground">Lieu :</span> {ev.location}</div>
          )}
        </div>
      </header>

      {/* Image */}
      {ev.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ev.image}
          alt={ev.title}
          className="w-full h-[260px] md:h-[380px] object-cover rounded-xl border"
        />
      ) : (
        <div className="w-full h-[260px] md:h-[380px] rounded-xl border bg-gradient-to-br from-amber-100 to-orange-50" />
      )}

      {/* Description courte (depuis Event) */}
      {ev.description && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">À propos</h2>
          <p className="text-base text-muted-foreground whitespace-pre-line">
            {ev.description}
          </p>
        </section>
      )}

      {/* Contenu « texte de page » (stocké dans contentHtml mais c’est du texte simple) */}
      {page.contentHtml && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Informations détaillées</h2>
          <p className="text-base text-muted-foreground whitespace-pre-line">
            {page.contentHtml}
          </p>
        </section>
      )}

      {/* CTA inscription */}
      {ev.inscriptionLink && (
        <div>
          <a
            href={ev.inscriptionLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-md bg-amber-500 px-5 text-white text-base font-medium hover:bg-amber-600"
          >
            S’inscrire
          </a>
        </div>
      )}
    </main>
  );
}
