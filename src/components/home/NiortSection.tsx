// src/components/home/NiortSection.tsx
'use client';

import { motion } from "framer-motion";

import Section from "./Section";
import SectionHeader from "./SectionHeader";

const stats = [
  { label: "Capitale des Assurances", value: "Niort Tech" },
  { label: "Ecosystème startup", value: "Forte dynamique" },
  { label: "Vie étudiante", value: "Cool & abordable" },
  { label: "Accès", value: "TGV & A10" },
];

export default function NiortSection() {
  return (
    <Section className="py-16 md:py-24 bg-gradient-to-b from-orange-50/40 to-white">
      <SectionHeader
        eyebrow="Niort"
        title="Un terrain de jeu tech & étudiant"
        subtitle="Entreprises, collectivités, tiers-lieux et un coût de vie qui laisse respirer."
      />

      <div className="relative overflow-hidden rounded-xl border bg-white">
        {/* Marquee simple */}
        <div className="flex whitespace-nowrap py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            className="flex min-w-max gap-6 px-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {[...stats, ...stats].map((s, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-3 rounded-full bg-orange-50 px-4 py-2 text-sm"
              >
                <span className="font-semibold text-orange-700">{s.value}</span>
                <span className="text-muted-foreground">— {s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
