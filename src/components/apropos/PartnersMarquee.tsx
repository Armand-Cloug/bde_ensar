"use client";

type PartnerLite = {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
};

export default function PartnersMarquee({ partners }: { partners: PartnerLite[] }) {
  if (!partners?.length) return null;

  // on duplique la liste pour un scroll infini fluide
  const items = [...partners, ...partners];

  return (
    <div className="relative w-full overflow-hidden rounded-xl border bg-white">
      <div className="flex w-max gap-10 py-6 px-6 animate-[marquee_22s_linear_infinite]">
        {items.map((p, i) => (
          <a
            key={`${p.id}-${i}`}
            href={p.website ?? "#"}
            target={p.website ? "_blank" : undefined}
            rel="noreferrer"
            className="flex h-16 w-40 shrink-0 items-center justify-center opacity-80 transition hover:opacity-100"
            aria-label={p.name}
            title={p.name}
          >
            {p.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.logoUrl} alt={p.name} className="max-h-12 w-auto object-contain" />
            ) : (
              <span className="text-sm">{p.name}</span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
