"use client";

import Section from "./Section";
import SectionHeader from "./SectionHeader";
import { motion } from "framer-motion";
import Link from "next/link";
import { Network } from "lucide-react";

export default function AlumniSection() {
  return (
    <Section className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50/40">
      <SectionHeader
        eyebrow="Alumnis"
        title="Un réseau pour aller plus loin"
        subtitle="Partages d’expériences, opportunités, mentoring — la communauté continue après le diplôme."
      />
      <motion.div
        className="flex flex-col items-start justify-between gap-6 rounded-xl border bg-white p-6 md:flex-row md:items-center"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-start gap-3">
          <Network className="mt-1 h-6 w-6 text-orange-600" />
          <p className="max-w-2xl text-muted-foreground">
            Tu es ancien/ancienne ? Rejoins le réseau alumni pour aider, être
            aidé·e, recruter, trouver ou proposer des missions.
          </p>
        </div>

        <Link
          href="/account"
          className="rounded-full border px-5 py-2 font-medium text-orange-700 transition hover:bg-orange-50"
        >
          Devenir alumni
        </Link>
      </motion.div>
    </Section>
  );
}
