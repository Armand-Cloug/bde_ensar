// components/apropos/MembersCarousel.tsx
"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

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

  if (!members?.length) {
    return (
      <p className="text-muted-foreground">
        Aucun membre enregistré pour cette équipe.
      </p>
    );
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{ align: "start", loop: true }}
      className="w-full"
    >
      <CarouselContent>
        {members.map((m) => {
          const src = m.photo ?? m.user.image ?? "/avatar-placeholder.png";
          const fullName = `${m.user.firstName ?? ""} ${m.user.lastName ?? ""}`.trim() || "Membre";
          return (
            <CarouselItem
              key={m.id}
              className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <Card className="overflow-hidden h-full">
                {/* Image membre */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={fullName}
                  className="w-full h-56 object-cover"
                />

                <CardContent className="p-4 space-y-1">
                  <div className="font-semibold">{fullName}</div>
                  {m.poste && (
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      {m.poste}
                    </div>
                  )}
                  {m.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                      {m.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
