// src/components/home/BDESection.tsx
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { PartyPopper, Users2, CalendarDays, HeartHandshake } from 'lucide-react';

import Section from './Section';
import SectionHeader from './SectionHeader';

type IgItem = {
  id: string;
  caption?: string | null;
  media_type: string;
  media_url?: string | null;
  thumbnail_url?: string | null;
  permalink: string;
  timestamp?: string | null;
};

const items = [
  {
    icon: PartyPopper,
    title: 'Ambiance & événements',
    text: "Soirées, tournois, afterworks, galas… l’asso fait battre le cœur du campus.",
  },
  {
    icon: CalendarDays,
    title: 'Animation du campus',
    text: 'Des rendez-vous réguliers pour créer du lien entre promotions.',
  },
  {
    icon: Users2,
    title: 'Communauté',
    text: 'Rencontres, entraide, intégration — un réseau solidaire et actif.',
  },
  {
    icon: HeartHandshake,
    title: 'Partenariats',
    text: 'Avantages adhérents, sponsors locaux et acoustions étudiantes.',
  },
];

export default function BDESection({ showInstagram = false }: { showInstagram?: boolean }) {
  const [ig, setIg] = React.useState<IgItem[] | null>(null);

  React.useEffect(() => {
    let cancel = false;
    async function load() {
      if (!showInstagram) return;
      try {
        const res = await fetch('/api/social/instagram?limit=5', { cache: 'no-store' });
        const j = await res.json().catch(() => ({ items: [] }));
        if (!cancel) setIg(Array.isArray(j?.items) ? j.items : []);
      } catch {
        if (!cancel) setIg([]);
      }
    }
    load();
    return () => {
      cancel = true;
    };
  }, [showInstagram]);

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

      <motion.div
        className="mt-10 rounded-xl border bg-white p-5"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {showInstagram ? (
          <>
            {ig === null ? (
              // Loader
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="aspect-square animate-pulse rounded-xl bg-orange-200/40" />
                ))}
              </div>
            ) : ig.length === 0 ? (
              // Fallback doux si pas de posts / erreur API
              <div className="flex flex-col items-center justify-center gap-2 py-12">
                <div className="h-3 w-40 rounded-full bg-orange-200/60" />
                <div className="h-3 w-64 rounded-full bg-orange-200/40" />
                <p className="mt-2 text-xs text-muted-foreground">
                  Impossible de charger les posts Instagram pour le moment.
                </p>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                {ig.map((p) => {
                  const img =
                    p.media_type === 'VIDEO' ? p.thumbnail_url || p.media_url : p.media_url;
                  return (
                    <a
                      key={p.id}
                      href={p.permalink}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative block overflow-hidden rounded-xl border bg-white"
                    >
                      <img
                        src={img || '/placeholder.svg'}
                        alt={p.caption ?? 'Instagram'}
                        className="aspect-square h-auto w-full object-cover transition-transform group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          // Placeholder si showInstagram = false
          <div className="flex flex-col items-center justify-center gap-2 py-12">
            <div className="h-3 w-40 animate-pulse rounded-full bg-orange-200/60" />
            <div className="h-3 w-64 animate-pulse rounded-full bg-orange-200/40" />
            <p className="mt-2 text-xs text-muted-foreground">
              Bientôt : derniers posts Instagram du BDE ✨
            </p>
          </div>
        )}
      </motion.div>
    </Section>
  );
}
