// src/components/home/FormationsSection.tsx
'use client';

import { motion } from "framer-motion";
import { GraduationCap, BookOpenCheck, Rocket } from "lucide-react";

import Section from "./Section";
import SectionHeader from "./SectionHeader";

const formations = [
  {
    icon: GraduationCap,
    title: "Diplome d'Ingénieur",
    lines: ["Sciende de la donnée", "Gestion des risque QSE", "Gestion des risque SSI"],
  },
  {
    icon: BookOpenCheck,
    title: "Master SI",
    lines: ["Risk Manager", "Préventeur", "Alternance & Stage"],
  },
  {
    icon: Rocket,
    title: "Master Actuariat",
    lines: ["Responsable d’études actuarielles", "Technicien(ne) d’actuariat", "Alternance & Stage"],
  },
];

export default function FormationsSection() {
  return (
    <Section className="py-16 md:py-24">
      <SectionHeader
        eyebrow="Formations"
        title="Des parcours tech ancrés dans le réel"
        subtitle="Des compétences solides, des projets concrets, un profil opérationnel."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {formations.map((f, i) => (
          <motion.div
            key={f.title}
            className="relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-transform hover:scale-[1.015]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            viewport={{ once: true }}
          >
            <f.icon className="mb-3 h-7 w-7 text-orange-600" />
            <h3 className="text-xl font-semibold">{f.title}</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {f.lines.map((l) => (
                <li key={l}>• {l}</li>
              ))}
            </ul>

            <div className="pointer-events-none absolute -right-28 -top-28 h-56 w-56 rounded-full bg-orange-100/60 blur-2xl" />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
