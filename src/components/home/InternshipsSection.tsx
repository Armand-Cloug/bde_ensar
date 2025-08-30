// src/components/home/InternshipsSection.tsx
'use client';

import { motion } from "framer-motion";

import Section from "./Section";
import SectionHeader from "./SectionHeader";
import Link from "next/link";

export default function InternshipsSection() {
  return (
    <Section className="py-16 md:py-24">
      <SectionHeader
        eyebrow="Stages"
        title="Explorer la carte des stages"
        subtitle="Découvre où les étudiants sont déjà partis — et prépare tes candidatures."
      />

      <motion.div
        className="flex flex-col items-start justify-between gap-6 rounded-xl border bg-white p-6 md:flex-row md:items-center"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* “Globe” minimaliste */}
        <div className="relative h-28 w-28 shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-200 to-orange-100" />
          <div className="absolute inset-2 rounded-full border-2 border-orange-600/30" />
          <div className="absolute inset-6 rounded-full border border-orange-600/20" />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "repeating-conic-gradient(from 0deg, transparent 0 10deg, rgba(234,88,12,0.2) 10deg 12deg)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <p className="max-w-2xl text-muted-foreground">
          Une carte interactive présente les retours d’expérience valider par le
          BDE. Idéal pour repérer des contacts et des entreprises.
        </p>

        <Link
          href="/stages"
          className="rounded-full bg-orange-600 px-5 py-2 font-medium text-white transition hover:bg-orange-700"
        >
          Voir la carte
        </Link>
      </motion.div>
    </Section>
  );
}
