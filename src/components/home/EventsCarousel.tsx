// components/home/EventsCarousel.tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type EventCard = {
  id: string;
  title: string;
  description: string;
  date: string | Date;
  location?: string | null;
  image?: string | null;
};

export default function EventsCarousel({ events }: { events: EventCard[] }) {
  const data = useMemo(
    () =>
      events.map((e) => ({
        ...e,
        date: new Date(e.date),
      })),
    [events]
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (data.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % data.length);
    }, 5000);
    return () => clearInterval(id);
  }, [data.length]);

  if (data.length === 0) {
    return (
      <div className="rounded-xl border p-6 text-muted-foreground">
        Aucun événement à venir.
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border bg-white">
      {data.map((ev, i) => {
        const active = i === index;
        return (
          <div
            key={ev.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              active ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            {/* Image de fond */}
            <div className="relative h-[420px] md:h-[520px]">
              <Image
                src={ev.image || "/event-placeholder.jpg"}
                alt={ev.title}
                fill
                className="object-cover"
                priority={i === 0}
              />

              {/* Cartouche haut-gauche : titre / date / lieu */}
              <div className="absolute left-5 top-5 bg-white/90 backdrop-blur rounded-2xl px-6 py-4 shadow max-w-[90%]">
                <div className="text-lg md:text-xl font-semibold leading-tight">
                  {ev.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {ev.date.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {ev.location ? ` • ${ev.location}` : ""}
                </div>
              </div>

              {/* Cartouche bas-droit : description */}
              <div className="absolute right-5 bottom-5 bg-white/90 backdrop-blur rounded-2xl px-6 py-4 shadow max-w-[95%] md:max-w-[60%]">
                <p className="text-sm md:text-base text-muted-foreground line-clamp-6 md:line-clamp-5">
                  {ev.description}
                </p>
              </div>

              {/* Points de pagination */}
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                {data.map((_, dot) => (
                  <button
                    key={dot}
                    onClick={() => setIndex(dot)}
                    className={cn(
                      "h-2.5 w-2.5 rounded-full border border-white/70",
                      dot === index ? "bg-white" : "bg-white/40"
                    )}
                    aria-label={`Aller à la slide ${dot + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
