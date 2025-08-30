// src/components/gallery/PhotosCarousel.tsx
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import * as React from 'react';

type Photo = { src: string; alt?: string };

export default function PhotosCarousel({
  photos,
  className = '',
}: {
  photos: Photo[];
  className?: string;
}) {
  const [index, setIndex] = React.useState(0);
  const total = photos.length;

  const prev = React.useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const next = React.useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);

  // Navigation clavier
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  if (!total) {
    return (
      <div className="w-full aspect-[16/9] grid place-items-center border rounded-xl bg-muted/20">
        <p className="text-sm text-muted-foreground">Aucune photo</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      {/* Image */}
      <div className="w-full aspect-[16/9] overflow-hidden rounded-2xl border bg-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[index].src}
          alt={photos[index].alt ?? `Photo ${index + 1}`}
          className="w-full h-full object-contain bg-neutral-950"
        />
      </div>

      {/* Boutons */}
      <button
        aria-label="Précédent"
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        aria-label="Suivant"
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Indicateurs */}
      <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Aller à la photo ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === index ? 'bg-amber-500' : 'bg-white/70 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
