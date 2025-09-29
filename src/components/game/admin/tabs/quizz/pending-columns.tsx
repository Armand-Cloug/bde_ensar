'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import type { ColumnDef } from '@tanstack/react-table'
import type { QuizzRow } from './columns'
import * as React from "react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

function allowedPointsFor(difficulty: string): number[] {
  const d = String(difficulty).trim().toLowerCase()
  if (['hard', 'difficile'].includes(d)) return [500, 750, 1000]
  if (['medium', 'moyen'].includes(d)) return [200, 300, 400]
  return [50, 100, 150] // easy / facile / par défaut
}

export const columns = ({
  onValidated, onDeleted,
}: {
  onValidated?: () => void
  onDeleted?: () => void
}): ColumnDef<QuizzRow>[] => [
  { id: 'category', header: 'Catégorie', cell: ({ row }) => row.original.category },
  { id: 'question', header: 'Question', cell: ({ row }) => <span className="line-clamp-2">{row.original.question}</span> },
  { id: 'difficulty', header: 'Difficulté', cell: ({ row }) => row.original.difficulty },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <PendingActions q={row.original} onValidated={onValidated} onDeleted={onDeleted} />
    ),
  },
]

function PendingActions({
  q, onValidated, onDeleted,
}: { q: QuizzRow; onValidated?: () => void; onDeleted?: () => void }) {
  const { toast } = useToast()
  const options = allowedPointsFor(q.difficulty)
  const [selected, setSelected] = React.useState<string>(String(options[0] ?? ''))

  async function validate() {
    const points = Number(selected)
    if (!points || !options.includes(points)) {
      toast({ title: 'Points requis', description: 'Choisis un nombre de points valide.', variant: 'destructive' })
      return
    }
    const res = await fetch('/api/game/admin/quizz/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: q.id, points }),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      toast({ title: 'Validation impossible', description: j?.message ?? 'Erreur serveur', variant: 'destructive' })
      return
    }
    toast({ title: 'Question validée', description: `Points attribués : ${points}` })
    onValidated?.()
  }

  async function remove() {
    const res = await fetch('/api/game/admin/quizz/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: q.id }),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      toast({ title: 'Suppression impossible', description: j?.message ?? 'Erreur serveur', variant: 'destructive' })
      return
    }
    toast({ title: 'Question supprimée' })
    onDeleted?.()
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Points" />
        </SelectTrigger>
        <SelectContent>
          {options.map((p) => (
            <SelectItem key={p} value={String(p)}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={validate}>
        Valider
      </Button>
      <Button size="sm" variant="destructive" onClick={remove}>
        Supprimer
      </Button>
    </div>
  )
}
