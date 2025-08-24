// components/stages/SpotsMapClient.tsx
"use client";

import dynamic from "next/dynamic";

export type Spot = {
  id: string;
  title?: string | null;
  companyName: string;
  address?: string | null;
  city?: string | null;
  countryName?: string | null;
  website?: string | null;
  contactEmail?: string | null;
  description?: string | null;
  lat: number;
  lng: number;
};

// charge réellement la carte seulement côté client
const SpotsMap = dynamic(() => import("./SpotsMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[70vh] w-full rounded-xl border bg-amber-50/40 animate-pulse" />
  ),
});

export default function SpotsMapClient({ spots }: { spots: Spot[] }) {
  return <SpotsMap spots={spots} />;
}
