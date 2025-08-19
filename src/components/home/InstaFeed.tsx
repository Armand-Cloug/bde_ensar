// components/home/InstaFeed.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

type InstaPost = {
  id: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  media_type?: string;
  timestamp?: string;
};

export default function InstaFeed() {
  const [posts, setPosts] = useState<InstaPost[]>([]);
  const [ok, setOk] = useState<boolean>(true);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/instagram/latest", { cache: "no-store" });
        const j = await res.json();
        setOk(j?.ok !== false);
        setPosts(Array.isArray(j?.posts) ? j.posts : []);
      } catch {
        setOk(false);
      }
    })();
  }, []);

  if (!ok || posts.length === 0) {
    return (
      <div className="rounded-xl border p-6 flex flex-col items-center justify-center text-center">
        <Instagram className="h-8 w-8 mb-3" />
        <p className="text-sm text-muted-foreground">
          Impossible d’afficher les derniers posts pour le moment.
        </p>
        <Link
          href="https://www.instagram.com/bde_ensar"
          target="_blank"
          className="mt-3 underline"
        >
          Voir le compte Instagram
        </Link>
      </div>
    );
  }

  function scroll(dir: "left" | "right") {
    const el = scroller.current;
    if (!el) return;
    const delta = el.clientWidth * 0.9;
    el.scrollBy({ left: dir === "left" ? -delta : delta, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          ref={scroller}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
        >
          {posts.map((p) => {
            const src = p.media_url || p.thumbnail_url!;
            return (
              <Link
                key={p.id}
                href={p.permalink}
                target="_blank"
                className="min-w-[260px] max-w-[260px] snap-start shrink-0 rounded-xl border bg-white"
              >
                <div className="relative w-[260px] h-[260px]">
                  <Image src={src} alt="post" fill className="object-cover rounded-t-xl" />
                </div>
                <div className="px-3 py-2 text-xs text-muted-foreground line-clamp-2">
                  {p.caption || "Publication Instagram"}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Flèches */}
      <div className="hidden md:flex items-center justify-between absolute inset-y-0 -left-3 -right-3 pointer-events-none">
        <Button
          size="icon"
          variant="secondary"
          className="pointer-events-auto shadow"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="pointer-events-auto shadow"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
