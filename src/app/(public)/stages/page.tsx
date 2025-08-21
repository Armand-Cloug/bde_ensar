// app/(public)/stages/page.tsx
import { db } from "@/lib/db";
import SpotsMap from "@/components/stages/SpotsMap";

export default async function StagesPage() {
  // Récupère uniquement les champs nécessaires
  const spots = await db.internshipSpot.findMany({
    where: { approved: true },
    select: {
      id: true,
      lat: true,
      lng: true,
      companyName: true,
      city: true,
      countryName: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="px-4 md:px-6 max-w-screen-2xl mx-auto w-full py-10 space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Stages à l’étranger</h1>
        <p className="text-muted-foreground mt-2">
          Explore les stages déjà réalisés par les étudiants sur la carte
          interactive. Clique sur un marqueur pour voir les infos principales.
        </p>
      </header>

      {/* On passe explicitement la prop spots */}
      <SpotsMap spots={spots} />
    </main>
  );
}
