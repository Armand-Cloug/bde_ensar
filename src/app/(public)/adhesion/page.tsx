// app/(public)/adhesion/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import {
  ShieldCheck,
  PartyPopper,
  Ticket,
  Users,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  CalendarClock,
} from "lucide-react";

import Image from "next/image";
import AdhesionPayButton from "@/components/adhesion/AdhesionPayButton";

export default async function AdhesionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const { success } = await searchParams;
  const session = await getServerSession(authOptions);

  const isAdherent = Boolean((session?.user as any)?.isAdherent);
  if (isAdherent) redirect("/");
  if (success === "1") redirect("/");

  const isAuth = Boolean(session?.user);
  const price =
    Number(process.env.STRIPE_ADHESION_PRICE_CENTS ?? "1500") / 100;

  return (
    <main className="relative px-4 md:px-6 max-w-6xl mx-auto py-10 md:py-14">
      {/* Décor doux (orange) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-20 h-[340px] w-[340px] rounded-full bg-orange-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -right-10 h-[300px] w-[300px] rounded-full bg-amber-200/40 blur-3xl"
      />

      {/* HERO */}
      <section className="relative grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        {/* Texte */}
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 border-orange-100">
            <Sparkles className="h-3.5 w-3.5" />
            Adhésion BDE ENSAR
          </span>

          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Rejoins la <span className="text-orange-600">communauté du  BDE ENSAR</span>
          </h1>

          <p className="mt-3 text-base md:text-lg text-muted-foreground">
            Tarifs réduits, soirées exclusives, goodies partenaires et un réseau
            actif toute l’année. Ton adhésion te donne accès à tout l’écosystème
            du BDE.
          </p>

          {/* prix + CTA pill */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="rounded-xl border bg-white px-4 py-3">
              <div className="text-sm text-muted-foreground">Cotisation</div>
              <div className="text-2xl font-semibold">
                {price}€{" "}
                <span className="text-base font-normal text-muted-foreground">
                  / an
                </span>
              </div>
            </div>

            {isAuth ? (
              <div className="rounded-full bg-black p-1">
                <AdhesionPayButton />
              </div>
            ) : (
              <a
                href={`/sign-in?callbackUrl=${encodeURIComponent("/adhesion")}`}
                className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-white text-sm font-medium hover:opacity-90"
              >
                Se connecter pour adhérer <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </div>

          <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            Paiement sécurisé par Stripe – activation immédiate
          </p>
        </div>

        {/* Image / carte */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="relative h-[240px] sm:h-[320px] md:h-[380px]">
              <Image
                src="/adhesion.jpg"
                alt="Adhésion BDE ENSAR"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                “Des soirées mémorables, des bons plans et une vraie vie
                associative.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ÉTAPES */}
      <section className="mt-12 md:mt-16 rounded-2xl border bg-white p-5 md:p-6">
        <h3 className="text-xl font-semibold">Comment ça marche ?</h3>
        <ol className="mt-4 grid gap-4 md:grid-cols-3">
          <Step
            n={1}
            title="Connexion"
            text="Connecte-toi (ou crée un compte) pour lier ton adhésion."
          />
          <Step
            n={2}
            title="Paiement"
            text="Valide via Stripe en CB ou en allant voir notre trésorier en liquide, c’est rapide et sécurisé."
          />
          <Step
            n={3}
            title="C’est parti !"
            text="Ton statut passe en adhérent instantanément."
          />
        </ol>
        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarClock className="h-4 w-4" />
          L’adhésion est valable jusqu’au 1er septembre suivant.
        </p>
      </section>

      {/* AVANTAGES */}
      <section className="mt-12 md:mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">Avantages</h2>
            <p className="text-muted-foreground">
              Concrets, immédiats, toute l’année.
            </p>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Feature
            icon={<Ticket className="h-5 w-5" />}
            title="Tarifs réduits"
            text="Réductions sur la plupart de nos événements."
          />
          <Feature
            icon={<PartyPopper className="h-5 w-5" />}
            title="Soirées exclusives"
            text="Accès aux événements réservés aux adhérents."
          />
          <Feature
            icon={<ShoppingBag className="h-5 w-5" />}
            title="Goodies & partenaires"
            text="Promos et cadeaux via nos partenaires."
          />
          <Feature
            icon={<Users className="h-5 w-5" />}
            title="Accés aux Cours"
            text="Accède aux cours faits par les élèves pour les élèves."
          />
        </div>
      </section>
    </main>
  );
}

/* ---------- UI helpers ---------- */

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 transition hover:shadow-sm">
      <div className="flex items-center gap-2">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-orange-600">
          {icon}
        </div>
        <div className="font-medium">{title}</div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">{text}</p>
    </div>
  );
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <li className="relative rounded-xl border p-4">
      <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-white text-sm font-semibold shadow">
        {n}
      </div>
      <div className="font-medium">{title}</div>
      <p className="text-sm text-muted-foreground mt-1">{text}</p>
    </li>
  );
}
