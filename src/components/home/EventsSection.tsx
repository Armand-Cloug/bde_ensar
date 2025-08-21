"use client";

import Section from "./Section";
import SectionHeader from "./SectionHeader";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

const sampleEvents = [
  { title: "Soirée d’intégration", date: "Septembre", place: "Niort" },
  { title: "Tournoi esport", date: "Octobre", place: "Campus" },
  { title: "Afterwork partenaires", date: "Novembre", place: "Tiers-Lieu" },
  { title: "Gala d’hiver", date: "Décembre", place: "Centre-ville" },
  { title: "Hackathon", date: "Février", place: "ENSAR" },
];

export default function EventsSection() {
  return (
    <Section className="py-16 md:py-24">
      <SectionHeader
        eyebrow="Événements"
        title="Des moments forts toute l’année"
        subtitle="Un aperçu du rythme… et on garde le meilleur pour la suite."
      />
      <div className="relative">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3">
          {sampleEvents.map((e, i) => (
            <motion.article
              key={e.title}
              className="snap-start min-w-[280px] rounded-xl border bg-white p-5 shadow-sm"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold">{e.title}</h3>
              <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  {e.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-orange-600" />
                  {e.place}
                </span>
              </div>
              <div className="mt-4 h-2 w-24 rounded-full bg-orange-200/70" />
              <div className="mt-2 h-2 w-16 rounded-full bg-orange-200/40" />
            </motion.article>
          ))}
        </div>
      </div>
    </Section>
  );
}
