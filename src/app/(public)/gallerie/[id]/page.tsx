// app/(public)/gallerie/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import PhotosCarousel from '@/components/gallery/PhotosCarousel';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ev = await db.galleryEvent.findUnique({
    where: { id },
    include: {
      photos: {
        orderBy: { id: 'asc' },
        select: { id: true, imagePath: true, caption: true },
      },
    },
  });

  if (!ev || !ev.isActive) {
    notFound();
  }

  const photos = (ev.photos ?? []).map((p) => ({
    src: p.imagePath,
    alt: p.caption ?? ev.title,
  }));

  return (
    <main className="relative px-4 md:px-6 max-w-6xl mx-auto py-10 md:py-14 space-y-8">
      {/* halos orange */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-20 h-[320px] w-[320px] rounded-full bg-orange-200/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-10 h-[280px] w-[280px] rounded-full bg-amber-200/40 blur-3xl" />

      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          {ev.title}
        </h1>
        <Link
          href="/gallerie"
          className="inline-flex items-center gap-1 text-sm text-orange-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux albums
        </Link>
      </header>

      {ev.description ? (
        <p className="text-muted-foreground">{ev.description}</p>
      ) : null}

      <PhotosCarousel photos={photos} />

      {/* Mini-grille de vignettes (optionnel) */}
      {photos.length > 1 ? (
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {photos.map((p, i) => (
            <div key={i} className="border rounded overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" className="w-full h-20 object-cover" />
            </div>
          ))}
        </div>
      ) : null}
    </main>
  );
}
