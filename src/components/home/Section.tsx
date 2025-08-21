"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

export default function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative w-full", className)}>
      <motion.div
        className="mx-auto w-full max-w-6xl px-4 md:px-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.35 }}
      >
        {children}
      </motion.div>
    </section>
  );
}
