// src/components/home/AdhesionSection.tsx
'use client';

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import Section from "./Section";
import SectionHeader from "./SectionHeader";
import Link from "next/link";

const benefits = [
  "Tarifs réduits sur les événements",
  "Avantages partenaires",
  "Accès aux anals du BDE",
  "Réseau & entraide",
];

export default function AdhesionSection() {
  return (
    <Section className="py-16 md:py-24">
      <SectionHeader
        eyebrow="Adhésion"
        title="Rejoins l’aventure ✨"
        subtitle="Soutiens l’asso et profite de tous les avantages."
      />

      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white md:p-10">
        <motion.ul
          className="grid grid-cols-1 gap-3 md:grid-cols-2"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {benefits.map((b, i) => (
            <motion.li
              key={b}
              className="flex items-center gap-2 text-sm md:text-base"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              viewport={{ once: true }}
            >
              <CheckCircle2 className="h-5 w-5 text-white/90" />
              {b}
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-6">
          <Link
            href="/adhesion"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-orange-700 transition hover:bg-orange-50"
          >
            Payer l’adhésion
          </Link>
        </div>

        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-2xl" />
      </div>
    </Section>
  );
}
