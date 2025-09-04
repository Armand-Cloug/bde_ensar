// src/components/apropos/MembersCarousel.tsx
'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Autoplay from 'embla-carousel-autoplay';

type Member = {
  id: string;
  poste: string;
  photo: string | null;
  description: string | null;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    image: string | null;
    email: string | null;
  };
};

export default function MembersCarousel({ members }: { members: Member[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnMouseEnter: true, stopOnInteraction: false })
  );

  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState<Member | null>(null);

  const openDialog = (m: Member) => {
    setCurrent(m);
    setOpen(true);
  };

  const fullName = (m: Member) =>
    `${m.user.firstName ?? ''} ${m.user.lastName ?? ''}`.trim() || 'Membre';

  if (!members?.length) {
    return <p className="text-muted-foreground">Aucun membre enregistré pour cette équipe.</p>;
  }

  return (
    <>
      <Carousel plugins={[plugin.current]} opts={{ align: 'start', loop: true }} className="w-full">
        <CarouselContent>
          {members.map((m) => {
            const src = m.photo ?? m.user.image ?? '/avatar-placeholder.png';
            return (
              <CarouselItem
                key={m.id}
                className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <Card
                  role="button"
                  tabIndex={0}
                  onClick={() => openDialog(m)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openDialog(m)}
                  className="overflow-hidden h-full transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  aria-label={`Voir le détail de ${fullName(m)}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={fullName(m)} className="w-full h-56 object-cover" />

                  <CardContent className="p-4 space-y-1">
                    <div className="font-semibold truncate">{fullName(m)}</div>
                    {m.poste && (
                      <div className="text-xs uppercase tracking-wide text-muted-foreground truncate">
                        {m.poste}
                      </div>
                    )}
                    {m.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                        {m.description}
                      </p>
                    )}
                    <p className="text-xs text-orange-700 mt-2">Clique pour en savoir plus</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Dialog détail membre */}
      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setCurrent(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          {current && (
            <>
              <DialogHeader>
                <DialogTitle>{fullName(current)}</DialogTitle>
                {current.poste ? (
                  <DialogDescription className="uppercase tracking-wide">
                    {current.poste}
                  </DialogDescription>
                ) : null}
              </DialogHeader>

              <div className="mt-2 flex gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.photo ?? current.user.image ?? '/avatar-placeholder.png'}
                  alt={fullName(current)}
                  className="w-28 h-28 rounded-md object-cover border"
                />
                <div className="text-sm space-y-2">
                  {current.description ? (
                    <p className="whitespace-pre-line">{current.description}</p>
                  ) : (
                    <p className="text-muted-foreground">Aucune description fournie.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
