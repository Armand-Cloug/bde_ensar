'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { DataTableServer } from '@/components/admin/tabs/users/data-table-server'
import { columns as makeColumns, type RankingRow } from './ranking/columns'
import CreateScoreDialog from './ranking/CreateScoreDialog'

function useDebounced<T>(value: T, delay = 350) {
  const [deb, setDeb] = React.useState(value)
  React.useEffect(() => {
    const id = setTimeout(() => setDeb(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return deb
}

const GAME_OPTIONS = [
  { value: 'quizz', label: 'Jeu 1 · Quizz' },
  { value: 'game2', label: 'Jeu 2' },
  { value: 'game3', label: 'Jeu 3' },
  { value: 'game4', label: 'Jeu 4' },
] as const
type GameKey = (typeof GAME_OPTIONS)[number]['value']

export default function RankingTab() {
  const [game, setGame] = React.useState<GameKey>('quizz')
  const [q, setQ] = React.useState('')
  const qDeb = useDebounced(q, 350)

  const [data, setData] = React.useState<RankingRow[]>([])
  const [loading, setLoading] = React.useState(true)
  const [page, setPage] = React.useState(1)
  const pageSize = 15
  const [total, setTotal] = React.useState(0)

  const [openAdd, setOpenAdd] = React.useState(false)

  React.useEffect(() => setPage(1), [qDeb, game])

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const url = `/api/game/admin/ranking?game=${encodeURIComponent(game)}&q=${encodeURIComponent(
        qDeb,
      )}&page=${page}&pageSize=${pageSize}`
      const res = await fetch(url, { cache: 'no-store' })
      const json = await res.json().catch(() => ({}))

      const rows: RankingRow[] = (json?.rows ?? []).map((r: any, i: number) => ({
        id: String(r.id),
        userId: String(r.userId),
        rank: (page - 1) * pageSize + (i + 1),
        score: Number(r.score ?? 0),
        createdAt: r.createdAt ?? null,
        user: {
          name:
            (r.user?.firstName || r.user?.lastName
              ? `${r.user?.firstName ?? ''} ${r.user?.lastName ?? ''}`.trim()
              : r.user?.name) || 'Utilisateur',
          image: r.user?.image ?? null,
          email: r.user?.email ?? null,
        },
      }))

      setData(rows)
      setTotal(Number(json?.total ?? rows.length))
    } finally {
      setLoading(false)
    }
  }, [game, qDeb, page])

  React.useEffect(() => {
    load()
  }, [load])

  const columns = React.useMemo(() => makeColumns(game, () => load()), [game, load])

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle>Classements</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={game} onValueChange={(v) => setGame(v as GameKey)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Jeu" />
            </SelectTrigger>
            <SelectContent>
              {GAME_OPTIONS.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="bg-amber-600 hover:bg-amber-700" onClick={() => setOpenAdd(true)}>
            + Créer un score
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <DataTableServer
          columns={columns}
          data={data}
          searchValue={q}
          onSearchChange={setQ}
          isLoading={loading}
          page={page}
          pageSize={pageSize}
          total={total}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => ((page * pageSize) >= total ? p : p + 1))}
        />
      </CardContent>

      <CreateScoreDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        defaultGame={game}
        onCreated={load}
      />
    </Card>
  )
}
