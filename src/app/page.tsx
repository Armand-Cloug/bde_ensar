// app/page.tsx
import HeroDiagonal from "@/components/home/HeroDiagonal";
import InstaFeed from "@/components/home/InstaFeed";
import EventsCarousel from "@/components/home/EventsCarousel";
import { db } from "@/lib/db";
import { Sparkles } from "lucide-react";

export default async function HomePage() {
  const now = new Date();
  const events = await db.event.findMany({
    where: { date: { gte: now } },
    orderBy: { date: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      location: true,
      image: true,
    },
  });

  return (
    <main className="relative flex flex-col">
      {/* Blobs décoratifs (orange) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-20 h-[320px] w-[320px] rounded-full bg-orange-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-10 h-[280px] w-[280px] rounded-full bg-amber-200/40 blur-3xl"
      />

      {/* 1) HERO */}
      <HeroDiagonal
        title="Bienvenue au BDE ENSAR"
        text={`Vivre le campus, organiser des événements inoubliables et créer du lien
entre promotions. Rejoins la vie associative et découvre nos prochains rendez-vous !`}
        imgSrc="/hero.jpg"
      />

      {/* 2) Instagram */}
      <section className="relative px-4 md:px-6 max-w-6xl mx-auto w-full py-12 md:py-16">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 border-orange-100">
            <Sparkles className="h-3.5 w-3.5" />
            Sur Instagram
          </span>
          <h2 className="mt-3 text-2xl md:text-3xl font-semibold">
            Derniers posts Instagram
          </h2>
          <p className="text-sm text-muted-foreground">
            Suis l’actu du BDE en temps réel.
          </p>
        </div>
        <InstaFeed />
      </section>

      {/* 3) Événements */}
      <section className="relative px-0 md:px-6 w-full py-12 md:py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto w-full">
          <div className="px-4 md:px-0 mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 border-orange-100">
              <Sparkles className="h-3.5 w-3.5" />
              Agenda
            </span>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold">
              Prochains événements
            </h2>
            <p className="text-sm text-muted-foreground">
              Ne rate pas les rendez-vous à venir.
            </p>
          </div>
          <EventsCarousel events={events} />
        </div>
      </section>
    </main>
  );
}
