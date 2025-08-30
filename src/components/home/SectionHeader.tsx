// src/components/home/SectionHeader.tsx
'use client';

import { motion } from "framer-motion";

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 md:mb-10">
      <motion.span
        className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {eyebrow}
      </motion.span>

      <motion.h2
        className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        viewport={{ once: true }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          className="mt-2 max-w-2xl text-muted-foreground"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
