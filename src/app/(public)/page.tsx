// src/app/page.tsx
import HeroCampus from "@/components/home/HeroCampus";
import BDESection from "@/components/home/BDESection";
import FormationsSection from "@/components/home/FormationsSection";
import NiortSection from "@/components/home/NiortSection";
import EventsSection from "@/components/home/EventsSection";
import AdhesionSection from "@/components/home/AdhesionSection";
import AlumniSection from "@/components/home/AlumniSection";
import InternshipsSection from "@/components/home/InternshipsSection";

export default function HomePage() {
  return (
    <main className="relative w-full overflow-x-hidden">
      <HeroCampus />
      <BDESection showInstagram />
      <AdhesionSection />
      <FormationsSection />
      <NiortSection />
      <EventsSection />
      <AlumniSection />
      <InternshipsSection />
    </main>
  );
}
