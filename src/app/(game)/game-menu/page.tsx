// src/app/(game)/game-menu/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

import DiscordWidget from "@/components/game/menu/DiscordWidget";

export const dynamic = "force-dynamic";

export default async function GameMenuPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="px-4 md:px-6 max-w-6xl mx-auto w-full py-10 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-bold">Espace Jeux</h1>
        <p className="text-muted-foreground">
          Bienvenue dans la partie jeu du site. Retrouve ici plusieurs mini-jeux pour
          te divertir, te challenger et grimper dans le classement. Choisis une section ci-dessous.
        </p>
      </header>

      <nav aria-label="Navigation jeux">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <li>
            <Link href="/quizz" className="block rounded-lg border p-4 hover:shadow-sm">
              <span className="font-medium">Jeu 1 : Quizz</span>
              <span className="block text-sm text-muted-foreground">
                Réponds aux questions et cumule des points.
              </span>
            </Link>
          </li>
          <li>
            <Link href="/game-2" className="block rounded-lg border p-4 hover:shadow-sm">
              <span className="font-medium">Jeu 2</span>
              <span className="block text-sm text-muted-foreground">
                Bientôt disponible.
              </span>
            </Link>
          </li>
          <li>
            <Link href="/game-3" className="block rounded-lg border p-4 hover:shadow-sm">
              <span className="font-medium">Jeu 3</span>
              <span className="block text-sm text-muted-foreground">
                Bientôt disponible.
              </span>
            </Link>
          </li>
          <li>
            <Link href="/game-4" className="block rounded-lg border p-4 hover:shadow-sm">
              <span className="font-medium">Jeu 4</span>
              <span className="block text-sm text-muted-foreground">
                Bientôt disponible.
              </span>
            </Link>
          </li>
          <li>
            <Link href="/leaderboard" className="block rounded-lg border p-4 hover:shadow-sm">
              <span className="font-medium">Leaderboard</span>
              <span className="block text-sm text-muted-foreground">
                Classement général des joueurs.
              </span>
            </Link>
          </li>
          <li>
            <Link href="/profile" className="block rounded-lg border p-4 hover:shadow-sm">
              <span className="font-medium">Profil</span>
              <span className="block text-sm text-muted-foreground">
                Tes infos et statistiques de jeu.
              </span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* ✅ Mise en avant Discord */}
      <DiscordWidget
        serverId="1420009866654646447"                 
        inviteUrl="https://discord.gg/WuSN9pV66Q"
        theme="dark"
        title="Rejoins le Discord du BDE"
        description="News, entraide, events et jeux : la communauté t’attend !"
      />
    </main>
  );
}
