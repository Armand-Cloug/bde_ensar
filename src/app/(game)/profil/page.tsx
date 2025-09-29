// src/app/profile/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  // Non connecté → page de login (avec retour sur /profile)
  if (!user) redirect(`/sign-in?callbackUrl=${encodeURIComponent("/profile")}`);

  // --- Données profil ---
  const firstName = user.first_name ?? user.firstName ?? "";
  const lastName = user.last_name ?? user.lastName ?? "";
  const displayName =
    (firstName || lastName) ? `${firstName} ${lastName}`.trim() : user.name ?? "Utilisateur";
  const image = user.image as string | undefined;

  // --- Scores & rang (Quizz) ---
  // Meilleur score de l'utilisateur sur le quizz
  const bestQuizz = await db.scoreQuizz.findFirst({
    where: { userId: user.id },
    orderBy: [{ score: "desc" }, { createdAt: "asc" }],
    select: { score: true },
  });

  // Classement: on calcule le meilleur score par user, puis on positionne l'utilisateur.
  // (Simple et robuste; optimisable plus tard si besoin)
  const groupedQuizz = await db.scoreQuizz.groupBy({
    by: ["userId"],
    _max: { score: true },
    orderBy: { _max: { score: "desc" } },
  });

  const totalPlayersQuizz = groupedQuizz.length;
  let rankQuizz: number | null = null;

  if (bestQuizz) {
    // nb d'utilisateurs dont le meilleur score est strictement supérieur
    const higher = groupedQuizz.filter((g) => (g._max.score ?? 0) > bestQuizz.score).length;
    rankQuizz = higher + 1;
  }

  // Placeholders pour les autres jeux (à venir)
  const games = [
    {
      key: "quizz",
      title: "Jeu 1 · Quizz",
      best: bestQuizz?.score ?? 0,
      rank: rankQuizz,
      total: totalPlayersQuizz,
      ready: true,
    },
    { key: "game2", title: "Jeu 2", best: null, rank: null, total: null, ready: false },
    { key: "game3", title: "Jeu 3", best: null, rank: null, total: null, ready: false },
    { key: "game4", title: "Jeu 4", best: null, rank: null, total: null, ready: false },
  ];

  return (
    <main className="px-4 md:px-6 max-w-6xl mx-auto w-full py-10 space-y-8">
      {/* Profil */}
      <header className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
          {image ? (
            <Image src={image} alt={displayName} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl font-semibold">
              {displayName
                .split(" ")
                .map((s: string) => s[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">Profil</h1>
          <p className="text-muted-foreground">{displayName}</p>
        </div>
      </header>

      {/* Scores & Classements */}
      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">Mes scores & classements</h2>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {games.map((g) => (
            <li
              key={g.key}
              className="rounded-lg border p-4 shadow-sm bg-card"
              aria-live="polite"
              aria-busy={!g.ready}
            >
              <div className="mb-2 text-base font-medium">{g.title}</div>

              {g.ready ? (
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-muted-foreground">Meilleur score : </span>
                    <span className="font-semibold">{g.best}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Classement : </span>
                    {g.rank ? (
                      <span className="font-semibold">
                        {g.rank}
                        <span className="text-muted-foreground"> / {g.total}</span>
                      </span>
                    ) : (
                      <span className="font-semibold">—</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Bientôt disponible</div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
