// src/components/leaderboard/LeaderboardClient.tsx
"use client"

import { useMemo, useState } from "react"
import Image from "next/image"

type PlayerRow = {
  rank: number
  userId: string
  score: number
  user: { id: string; name: string; image?: string }
}

type Props = {
  data?: {
    quizz: PlayerRow[]
    game2: PlayerRow[]
    game3: PlayerRow[]
    game4: PlayerRow[]
  }
}

const LABELS: Record<keyof NonNullable<Props["data"]>, string> = {
  quizz: "Jeu 1 · Quizz",
  game2: "Jeu 2",
  game3: "Jeu 3",
  game4: "Jeu 4",
}

export default function LeaderboardClient({ data }: Props) {
  const safe = data ?? { quizz: [], game2: [], game3: [], game4: [] }
  const [game, setGame] = useState<keyof typeof safe>("quizz")
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<PlayerRow | null>(null)

  const options = useMemo(
    () => (Object.keys(safe) as Array<keyof typeof safe>).map((k) => ({ key: k, label: LABELS[k] })),
    [safe],
  )

  const rows = safe[game] ?? []

  return (
    <>
      <div className="flex items-center gap-3">
        <label htmlFor="game" className="text-sm text-muted-foreground">
          Choisir un jeu
        </label>
        <select
          id="game"
          className="rounded-md border px-3 py-2 text-sm bg-background"
          value={game}
          onChange={(e) => setGame(e.target.value as keyof typeof safe)}
        >
          {options.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b px-4 py-3">
          <h2 className="text-lg font-semibold">{LABELS[game]}</h2>
          <p className="text-xs text-muted-foreground">
            {rows.length > 0 ? "Top 25" : "Aucun classement pour le moment."}
          </p>
        </div>

        {rows.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="[&>th]:px-4 [&>th]:py-2">
                <th>#</th>
                <th>Joueur</th>
                <th className="text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.userId}
                  className="cursor-pointer hover:bg-muted/40"
                  onClick={() => {
                    setSelected(r)
                    setOpen(true)
                  }}
                >
                  <td className="px-4 py-2 w-10">{r.rank}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Avatar image={r.user.image} name={r.user.name} />
                      <span className="font-medium">{r.user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right font-semibold">{r.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            Aucun classement pour le moment.
          </div>
        )}
      </div>

      <ProfileModal open={open} onClose={() => setOpen(false)} player={selected} />
    </>
  )
}

function Avatar({ image, name }: { image?: string; name: string }) {
  if (image) {
    return (
      <div className="relative h-8 w-8 overflow-hidden rounded-full bg-muted">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    )
  }
  const initials = name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold">
      {initials}
    </div>
  )
}

function ProfileModal({
  open,
  onClose,
  player,
}: {
  open: boolean
  onClose: () => void
  player: PlayerRow | null
}) {
  if (!open || !player) return null

  const name = player.user.name
  const initials = name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-6 flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
            {player.user.image ? (
              <Image src={player.user.image} alt={name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-semibold">
                {initials}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold leading-tight">Profil</h3>
            <p className="text-muted-foreground">{name}</p>
          </div>
        </header>

        <section className="space-y-3">
          <h4 className="text-lg font-semibold">Scores & classements</h4>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <li className="rounded-lg border p-4 shadow-sm bg-card">
              <div className="mb-2 text-base font-medium">{LABELS.quizz}</div>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-muted-foreground">Meilleur score : </span>
                  <span className="font-semibold">{player.score}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Classement (local) : </span>
                  <span className="font-semibold">
                    {player.rank}
                  </span>
                </div>
              </div>
            </li>
            {["Jeu 2", "Jeu 3", "Jeu 4"].map((label) => (
              <li key={label} className="rounded-lg border p-4 shadow-sm bg-card">
                <div className="mb-2 text-base font-medium">{label}</div>
                <div className="text-sm text-muted-foreground">Bientôt disponible</div>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
