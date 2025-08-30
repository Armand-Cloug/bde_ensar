// src/app/(public)/gallerie/page.tsx
import { unstable_noStore as noStore } from 'next/cache';
import { db } from '@/lib/db';
import { ImageIcon } from 'lucide-react';

import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function GalleryListPage() {
  noStore(); // ← force un rendu runtime, pas de cache ISR/SSG

  const events = await db.galleryEvent.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    include: {
      photos: { select: { imagePath: true }, take: 1, orderBy: { id: 'asc' } },
    },
  });

  return (
    <main className="relative px-4 md:px-6 max-w-6xl mx-auto py-10 md:py-14 space-y-8">
      {/* halos orange discrets */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-20 h-[320px] w-[320px] rounded-full bg-orange-200/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-10 h-[280px] w-[280px] rounded-full bg-amber-200/40 blur-3xl" />

      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Galerie <span className="text-orange-600">photos</span>
        </h1>
        <p className="text-muted-foreground">
          Parcours les albums des événements du BDE.
        </p>
      </header>

      {!events.length ? (
        <p className="text-sm text-muted-foreground">Aucun album actif pour le moment.</p>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev: any) => {
            const cover = ev.coverImage || ev.photos[0]?.imagePath || '';
            return (
              <Link
                key={ev.id}
                href={`/gallerie/${ev.id}`}
                className="group relative overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow"
              >
                <div className="relative w-full h-48 bg-neutral-100">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt={ev.title}
                      className="w-full h-full object-cover transition group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-neutral-400">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-1">{ev.title}</h3>
                  {ev.description ? (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {ev.description}
                    </p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </main>
  );
}
