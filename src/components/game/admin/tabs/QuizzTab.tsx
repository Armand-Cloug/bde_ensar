'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { DataTableServer } from '@/components/admin/tabs/users/data-table-server'
import { columns as makeActiveColumns, type QuizzRow } from './quizz/columns'
import { columns as makePendingColumns } from './quizz/pending-columns'
import CreateQuestionDialog from './quizz/CreateQuestionDialog'
import { AdminUser } from '../AdminPanel'

function useDebounced<T>(v: T, d = 350) {
  const [deb, setDeb] = React.useState(v)
  React.useEffect(() => { const id = setTimeout(() => setDeb(v), d); return () => clearTimeout(id) }, [v, d])
  return deb
}

type QuizzTabProps = {
  user: AdminUser
}

const CATEGORIES = [
  { value: 'general', label: 'Général' },
  { value: 'qse',     label: 'QSE' },
  { value: 'data',    label: 'Data' },
  { value: 'ssi',     label: 'SSI' },
] as const

type CatKey = (typeof CATEGORIES)[number]['value']

export default function QuizzTab({ user }: QuizzTabProps)  {
  // --- Actives ---
  const [cat, setCat] = React.useState<CatKey>('general')
  const [q, setQ] = React.useState('')
  const qDeb = useDebounced(q, 350)
  const [active, setActive] = React.useState<QuizzRow[]>([])
  const [loadingA, setLoadingA] = React.useState(true)
  const [pageA, setPageA] = React.useState(1)
  const pageSizeA = 15
  const [totalA, setTotalA] = React.useState(0)

  // --- Pending ---
  const [pending, setPending] = React.useState<QuizzRow[]>([])
  const [loadingP, setLoadingP] = React.useState(true)
  const [pageP, setPageP] = React.useState(1)
  const pageSizeP = 15
  const [totalP, setTotalP] = React.useState(0)

  const [openCreate, setOpenCreate] = React.useState(false)

  React.useEffect(() => { setPageA(1) }, [cat, qDeb])

  const loadActive = React.useCallback(async () => {
    setLoadingA(true)
    try {
      const url = `/api/game/admin/quizz?category=${encodeURIComponent(cat)}&q=${encodeURIComponent(qDeb)}&page=${pageA}&pageSize=${pageSizeA}`
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error('load active failed')
      const j = await res.json()
      const rows: QuizzRow[] = (j?.rows ?? []).map((r: any) => ({
        id: String(r.id),
        question: String(r.question ?? ''),
        answer: String(r.answer ?? ''),
        points: Number(r.points ?? 0),
        difficulty: String(r.difficulty ?? 'unknown'),
        category: String(r.category ?? 'general'),
        status: Boolean(r.status),
        createdAt: r.createdAt ?? null,
      }))
      setActive(rows)
      setTotalA(Number(j?.total ?? rows.length))
    } finally {
      setLoadingA(false)
    }
  }, [cat, qDeb, pageA])

  const loadPending = React.useCallback(async () => {
    setLoadingP(true)
    try {
      const url = `/api/game/admin/quizz/pending?page=${pageP}&pageSize=${pageSizeP}`
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error('load pending failed')
      const j = await res.json()
      const rows: QuizzRow[] = (j?.rows ?? []).map((r: any) => ({
        id: String(r.id),
        question: String(r.question ?? ''),
        answer: String(r.answer ?? ''),
        points: Number(r.points ?? 0),
        difficulty: String(r.difficulty ?? 'unknown'),
        category: String(r.category ?? 'general'),
        status: Boolean(r.status),
        createdAt: r.createdAt ?? null,
      }))
      setPending(rows)
      setTotalP(Number(j?.total ?? rows.length))
    } finally {
      setLoadingP(false)
    }
  }, [pageP])

  React.useEffect(() => { loadActive() }, [loadActive])
  React.useEffect(() => { loadPending() }, [loadPending])

  const activeColumns  = React.useMemo(() => makeActiveColumns({ onDeleted: loadActive }), [loadActive])
  const pendingColumns = React.useMemo(() => makePendingColumns({ onValidated: () => loadPending(), onDeleted: () => loadPending() }), [loadPending])

  return (
    <div className="space-y-8">
      {/* Tableau des questions actives */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle>Questions actives</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={cat} onValueChange={(v) => setCat(v as CatKey)}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Catégorie" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button className="bg-amber-600 hover:bg-amber-700" onClick={() => setOpenCreate(true)}>
              + Créer une question
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTableServer
            columns={activeColumns}
            data={active}
            searchValue={q}
            onSearchChange={setQ}
            isLoading={loadingA}
            page={pageA}
            pageSize={pageSizeA}
            total={totalA}
            onPrev={() => setPageA(p => Math.max(1, p - 1))}
            onNext={() => setPageA(p => (p * pageSizeA >= totalA ? p : p + 1))}
          />
        </CardContent>
      </Card>

      {/* Tableau des questions en attente */}
      <Card>
        <CardHeader>
          <CardTitle>En attente de validation</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTableServer
            columns={pendingColumns}
            data={pending}
            searchValue={''}         // recherche interne gérée côté tableau actif; ici on liste tout le pending
            onSearchChange={() => {}}
            isLoading={loadingP}
            page={pageP}
            pageSize={pageSizeP}
            total={totalP}
            onPrev={() => setPageP(p => Math.max(1, p - 1))}
            onNext={() => setPageP(p => (p * pageSizeP >= totalP ? p : p + 1))}
          />
        </CardContent>
      </Card>

      <CreateQuestionDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreated={() => { setOpenCreate(false); loadPending(); }}
      />
    </div>
  )
}
