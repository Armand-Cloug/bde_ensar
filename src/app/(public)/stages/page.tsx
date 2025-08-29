// app/(public)/stages/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';

import { db } from "@/lib/db";
import SpotsMapClient from "@/components/stages/SpotsMapClient";
import AddSpotDialog from "@/components/stages/AddSpotDialog";

export default async function StagesPage() {
  noStore(); // évite tout prerender/ISR

  // On affiche uniquement les points approuvés
  const spots = await db.internshipSpot.findMany({
    where: { approved: true },
    select: {
      id: true,
      title: true,
      companyName: true,
      address: true,
      city: true,
      countryName: true,
      website: true,
      contactEmail: true,
      description: true,
      lat: true,
      lng: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="px-4 md:px-6 max-w-screen-2xl mx-auto w-full py-10 space-y-6">
      <header className="flex items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Stages à l’étranger</h1>
          <p className="text-muted-foreground mt-2">
            Explore les stages déjà réalisés par les étudiants sur la carte
            interactive. Clique sur un marqueur pour voir les infos principales.
          </p>
        </div>

        {/* Bouton public pour proposer un point */}
        <AddSpotDialog />
      </header>

      {/* Carte (client) */}
      <SpotsMapClient spots={spots} />
    </main>
  );
}
