"use client";

import { motion } from "framer-motion";
import { University, School, Building2 } from "lucide-react";

export default function HeroCampus() {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden">
      {/* Fond avec split diagonal */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        {/* Bande orange diagonale */}
        <div
          className="absolute inset-y-0 right-[-20vw] w-[70vw] bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700"
          style={{
            clipPath:
              "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        />
        {/* Trame douce */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.07]">
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="mx-auto flex min-h-[92vh] w-full max-w-6xl items-center px-4 md:px-6">
        <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-2">
          {/* Texte */}
          <div className="relative">
            <motion.h1
              className="text-4xl font-extrabold tracking-tight md:text-6xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              BDE ENSAR
              <span className="block text-orange-600">Campus de Niort</span>
            </motion.h1>

            <motion.p
              className="mt-4 max-w-xl text-muted-foreground md:text-lg"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              Une vie associative vibrante au cœur de l’ENSAR, rattachée à
              l’Université de Poitiers. Événements, entraide, réseau et
              opportunités pour tous les étudiants.
            </motion.p>

            {/* Badges */}
            <motion.div
              className="mt-6 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Badge icon={School} label="ENSAR" />
              <Badge icon={Building2} label="Campus de Niort" />
              <Badge icon={University} label="Université de Poitiers" />
            </motion.div>
          </div>

          {/* Zone graphique animée */}
          <div className="relative h-[46vh] md:h-[56vh]">
            <FloatingGrid />
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({
  icon: Icon,
  label,
}: {
  icon: any;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-sm backdrop-blur-md">
      <Icon className="h-4 w-4 text-orange-600" />
      <span className="font-medium">{label}</span>
    </span>
  );
}

function FloatingGrid() {
  // Petites tuiles qui flottent et pulsent
  const tiles = Array.from({ length: 9 });

  return (
    <div className="relative h-full w-full rounded-xl border bg-white/60 p-2 backdrop-blur-md">
      <div className="grid h-full w-full grid-cols-3 gap-2">
        {tiles.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-lg bg-gradient-to-br from-orange-50 to-white p-4 shadow-sm"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: [0, -6, 0], opacity: 1 }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              delay: i * 0.12,
              ease: "easeInOut",
            }}
          >
            <div className="h-full w-full rounded-md border border-orange-100/60" />
          </motion.div>
        ))}
      </div>

      {/* halo */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/5" />
    </div>
  );
}
