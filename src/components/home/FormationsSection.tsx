"use client";

import Section from "./Section";
import SectionHeader from "./SectionHeader";
import { motion } from "framer-motion";
import { GraduationCap, BookOpenCheck, Rocket } from "lucide-react";

const formations = [
  {
    icon: GraduationCap,
    title: "Cycle Ingénieur",
    lines: ["Systèmes d’info", "Data & IA", "Cyber & Cloud"],
  },
  {
    icon: BookOpenCheck,
    title: "Licences & Masters",
    lines: ["Dév & DevOps", "UX/UI & Produit", "Business Tech"],
  },
  {
    icon: Rocket,
    title: "Projets & Alternances",
    lines: ["Rythmes adaptés", "Entreprise partenaire", "Insertion rapide"],
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
