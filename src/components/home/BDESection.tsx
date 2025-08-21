"use client";

import Section from "./Section";
import SectionHeader from "./SectionHeader";
import { motion } from "framer-motion";
import { PartyPopper, Users2, CalendarDays, HeartHandshake } from "lucide-react";

const items = [
  {
    icon: PartyPopper,
    title: "Ambiance & événements",
    text: "Soirées, tournois, afterworks, galas… l’asso fait battre le cœur du campus.",
  },
  {
    icon: CalendarDays,
    title: "Animation du campus",
    text: "Des rendez-vous réguliers pour créer du lien entre promotions.",
  },
  {
    icon: Users2,
    title: "Communauté",
    text: "Rencontres, entraide, intégration — un réseau solidaire et actif.",
  },
  {
    icon: HeartHandshake,
    title: "Partenariats",
    text: "Avantages adhérents, sponsors locaux et acoustions étudiantes.",
  },
];

export default function BDESection() {
  return (
    <Section className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50/40">
      <SectionHeader
        eyebrow="BDE ENSAR"
        title="Une association étudiante qui fait vivre le campus"
        subtitle="Nos missions : fédérer, animer, représenter — et faire kiffer."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            className="group relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-50/40 opacity-0 transition-opacity group-hover:opacity-100" />
            <it.icon className="mb-3 h-6 w-6 text-orange-600" />
            <h3 className="text-lg font-semibold">{it.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{it.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Placeholder feed Instagram (à brancher plus tard) */}
      <motion.div
        className="mt-10 rounded-xl border bg-white p-5"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col items-center justify-center gap-2 py-12">
          <div className="h-3 w-40 animate-pulse rounded-full bg-orange-200/60" />
          <div className="h-3 w-64 animate-pulse rounded-full bg-orange-200/40" />
          <p className="mt-2 text-xs text-muted-foreground">
            Bientôt : derniers posts Instagram du BDE ✨
          </p>
        </div>
      </motion.div>
    </Section>
  );
}
