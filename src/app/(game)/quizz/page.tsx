// src/app/(game)/quizz/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

import QuizzActions from "@/components/game/quizz/QuizzActions";
import QuizzGame from "@/components/game/quizz/QuizzGame";
import BestScore from "@/components/game/quizz/BestScore";

export default async function QuizzPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) redirect(`/sign-in?callbackUrl=${encodeURIComponent("/quizz")}`);

  const best = await db.scoreQuizz.findFirst({
    where: { userId: String(user.id) },
    orderBy: [{ score: "desc" }, { createdAt: "asc" }],
    select: { score: true },
  });

  return (
    <main className="px-4 md:px-6 max-w-6xl mx-auto w-full py-10 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-bold">Quizz</h1>
        <p className="text-muted-foreground">
          Réponds aux questions, gère tes 5 vies et tente de battre ton record !
        </p>
      </header>

      {/* Règles + meilleur score + actions */}
      <section className="grid gap-6 md:grid-cols-3">
        <article className="md:col-span-2 rounded-lg border bg-card p-4 space-y-3">
          <h2 className="text-xl font-semibold">Règles du jeu</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Tu démarres avec <b>5 vies</b>.</li>
            <li>Chaque question dure <b>30 secondes</b> — essais illimités pendant le temps.</li>
            <li>Si tu n’as pas la bonne réponse à temps : <b>–1 vie</b>. À 0 vie, la partie s’arrête et ton score est enregistré.</li>
            <li>
              Au démarrage tu choisis une <b>catégorie</b> :
              <code className="ml-1">all</code>, <code>general</code>, <code>qse</code>, <code>data</code>, <code>ssi</code>.
            </li>
            <li>
              Tu choisis aussi une <b>difficulté</b> :
              <ul className="list-disc pl-5">
                <li>Facile → uniquement des questions faciles</li>
                <li>Moyen → faciles + moyennes</li>
                <li>Difficile → faciles + moyennes + difficiles</li>
              </ul>
            </li>
            <li>Chaque bonne réponse rapporte les <b>points de la question</b> (fixés à la validation) — plus la difficulté est élevée, plus on peut scorer.</li>
            <li className="italic">Astuce : pour maximiser ton score, joue en <b>all</b> + <b>difficile</b>.</li>
          </ul>

          <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            🚫 <b>Anti-triche :</b> si tu changes d’onglet pendant une question, le champ de réponse
            se bloque et un message <i>“Tricheur !”</i> s’affiche.
          </div>
        </article>

        <aside className="rounded-lg border bg-card p-4 space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Ton meilleur score</div>
            <BestScore initial={best?.score ?? 0} />
          </div>
          <QuizzActions />
        </aside>
      </section>

      {/* Montage du jeu — passe en overlay plein écran quand on démarre */}
      <section>
        <QuizzGame />
      </section>
    </main>
  );
}
