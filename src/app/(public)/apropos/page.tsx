// app/apropos/page.tsx
import { db } from "@/lib/db";
import MembersCarousel from "@/components/apropos/MembersCarousel";

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

  if (!team) {
    return (
      <main className="px-4 py-10 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">À propos du BDE</h1>
        <p className="text-muted-foreground">
          Aucune équipe active n’a été définie pour le moment.
        </p>
      </main>
    );
  }

  return (
    <main className="px-4 py-10 max-w-6xl mx-auto space-y-10">
      {/* En-tête : année + photo + description */}
      <section className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">
          BDE {team.annee}
        </h1>

        <div className="grid gap-6 md:grid-cols-2 items-start">
          {/* Photo de groupe */}
          <div className="w-full overflow-hidden rounded-xl border">
            {/* Utilise <img> pour éviter la config Next/Image si URL externe */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={team.image ?? "/placeholder.png"}
              alt={`Photo de groupe BDE ${team.annee}`}
              className="w-full h-[260px] md:h-[360px] object-cover"
            />
          </div>

          {/* Description */}
          <div className="prose max-w-none">
            <p className="text-base leading-relaxed whitespace-pre-line">
              {team.description}
            </p>
          </div>
        </div>
      </section>

      {/* Carrousel des membres */}
      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold">Les membres</h2>
        <MembersCarousel members={team.members} />
      </section>
    </main>
  );
}
