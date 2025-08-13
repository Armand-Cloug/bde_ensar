// app/adhesion/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import AdhesionPayButton from "@/components/adhesion/AdhesionPayButton";
import { redirect } from "next/navigation";

export default async function AdhesionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const { success } = await searchParams;
  const session = await getServerSession(authOptions);
  const isAdherent = Boolean((session?.user as any)?.isAdherent);

  // ✅ Si déjà adhérent → on ne montre pas la page, on renvoie à l'accueil
  if (isAdherent) {
    redirect("/");
  }

  // ✅ Après retour Stripe (UX immédiate), on renvoie à l'accueil
  if (success === "1") {
    redirect("/");
  }

  const isAuth = Boolean(session?.user);

  return (
    <main className="px-4 py-10 max-w-6xl mx-auto space-y-10">
      <section className="grid gap-6 md:grid-cols-2 items-start">
        {/* Texte à gauche */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Adhésion BDE ENSAR</h1>
          <p className="text-lg leading-relaxed">
            Rejoins le BDE de l’ENSAR et profite d’un maximum d’avantages toute l’année.
          </p>

          {!isAuth ? (
            <a
              href={`/sign-in?callbackUrl=${encodeURIComponent("/adhesion")}`}
              className="inline-flex h-12 items-center justify-center rounded-md bg-black px-6 text-white text-base font-medium hover:opacity-90"
            >
              Se connecter pour adhérer
            </a>
          ) : (
            <AdhesionPayButton />
          )}
        </div>

        {/* Image à droite + avantages */}
        <div className="w-full overflow-hidden rounded-xl border">
          <Image
            src="/adhesion_pika.jpg"
            alt="Rejoins le BDE"
            width={1200}
            height={800}
            className="w-full h-[300px] md:h-[380px] object-cover"
            priority
          />
          <div className="p-4">
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Tarifs réduits sur les événements</li>
              <li>Accès aux soirées exclusives</li>
              <li>Goodies & offres partenaires</li>
              <li>Réseau et vie associative</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
