// app/apropos/page.tsx
import { db } from "@/lib/db";
import MembersCarousel from "@/components/apropos/MembersCarousel";
import PartnersMarquee from "@/components/apropos/PartnersMarquee";
import { Sparkles } from "lucide-react";

export default async function AproposPage() {
  const team = await db.bdeTeam.findFirst({
    where: { isActive: true },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              image: true,
              email: true,
            },
          },
        },
        orderBy: { poste: "asc" },
      },
    },
  });

  // Récupère les partenaires actifs (ordre perso puis alpha)
  const partners = await db.partner.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: { id: true, name: true, logoUrl: true, website: true },
  });

  if (!team) {
    return (
      <main className="px-4 md:px-6 max-w-6xl mx-auto py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">À propos du BDE</h1>
        <p className="text-muted-foreground">
          Aucune équipe active n’a été définie pour le moment.
        </p>

        {/* On peut, si tu veux, afficher les partenaires même sans équipe :
            décommente le bloc ci-dessous */}
        {/* {partners.length > 0 && (
          <section className="mt-10 space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold">Nos partenaires</h2>
            <PartnersMarquee partners={partners} />
          </section>
        )} */}
      </main>
    );
  }

  return (
    <main className="relative px-4 md:px-6 max-w-6xl mx-auto py-10 md:py-14 space-y-10">
      {/* Décors doux (orange) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-20 h-[320px] w-[320px] rounded-full bg-orange-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-10 h-[280px] w-[280px] rounded-full bg-amber-200/40 blur-3xl"
      />

      {/* En-tête : badge + titre */}
      <section className="relative space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 border-orange-100">
          <Sparkles className="h-3.5 w-3.5" />
          À propos
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          BDE <span className="text-orange-600">{team.annee}</span>
        </h1>

        {/* Photo + description */}
        <div className="grid gap-6 md:grid-cols-2 items-start">
          {/* Carte photo de groupe */}
          <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={team.image ?? "/placeholder.png"}
              alt={`Photo de groupe BDE ${team.annee}`}
              className="w-full h-[260px] md:h-[360px] object-cover"
            />
          </div>

          {/* Carte description */}
          <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm p-5 md:p-6">
            <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">
              {team.description}
            </p>
          </div>
        </div>
      </section>

      {/* Carrousel des membres */}
      <section className="relative space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold">L’équipe</h2>
        <p className="text-sm text-muted-foreground">
          Découvre les membres du BDE {team.annee}.
        </p>
        <MembersCarousel members={team.members} />
      </section>

      {/* Partenariats (ajout) */}
      {partners.length > 0 && (
        <section className="relative space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold">Nos partenaires</h2>
          <p className="text-sm text-muted-foreground">
            Merci à celles et ceux qui nous soutiennent.
          </p>
          <PartnersMarquee partners={partners} />
        </section>
      )}
    </main>
  );
}
