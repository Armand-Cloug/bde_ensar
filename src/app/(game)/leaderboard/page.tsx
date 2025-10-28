// src/app/(game)/leaderboard/page.tsx
import { db } from "@/lib/db"
import LeaderboardClient from "@/components/game/leaderboard/LeaderboardClient"

export const dynamic = 'force-dynamic'; // pas de SSG/ISR au build

function displayName(u: {
  firstName?: string | null
  lastName?: string | null
  name?: string | null
}) {
  const fn = u.firstName ?? ""
  const ln = u.lastName ?? ""
  if (fn || ln) return `${fn} ${ln}`.trim()
  return u.name ?? "Utilisateur"
}

export default async function LeaderboardPage() {
  // --- Top 25 QUIZZ (meilleur score par utilisateur) ---
  const groupedQuizz = await db.scoreQuizz.groupBy({
    by: ["userId"],
    _max: { score: true },
    orderBy: { _max: { score: "desc" } },
    take: 25,
  })

  const users = await db.user.findMany({
    where: { id: { in: groupedQuizz.map((g) => g.userId) } },
    select: { id: true, firstName: true, lastName: true, name: true, image: true },
  })
  const usersById = new Map(users.map((u) => [u.id, u]))

  const quizzTop = groupedQuizz.map((g, i) => {
    const u = usersById.get(g.userId)
    return {
      rank: i + 1,
      userId: g.userId,
      score: g._max.score ?? 0,
      user: {
        id: g.userId,
        name: displayName(u ?? {}),
        image: u?.image ?? undefined,
      },
    }
  })

  const data = {
    quizz: quizzTop,
    game2: [] as typeof quizzTop,
    game3: [] as typeof quizzTop,
    game4: [] as typeof quizzTop,
  }

  return (
    <main className="px-4 md:px-6 max-w-6xl mx-auto w-full py-10 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-bold">Leaderboards</h1>
        <p className="text-muted-foreground">
          Sélectionne un jeu pour afficher son classement (Top 25).
        </p>
      </header>
      <LeaderboardClient data={data} />
    </main>
  )
}
