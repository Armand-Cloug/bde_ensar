'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'

type GameKey = 'quizz' | 'game2' | 'game3' | 'game4'
const GAME_OPTIONS: { value: GameKey; label: string }[] = [
  { value: 'quizz', label: 'Jeu 1 · Quizz' },
  { value: 'game2', label: 'Jeu 2' },
  { value: 'game3', label: 'Jeu 3' },
  { value: 'game4', label: 'Jeu 4' },
]

type PickUser = { id: string; firstName: string | null; lastName: string | null; email: string | null }

function useDebounced<T>(value: T, delay = 350) {
  const [deb, setDeb] = React.useState(value)
  React.useEffect(() => {
    const id = setTimeout(() => setDeb(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return deb
}

export default function CreateScoreDialog({
  open,
  onOpenChange,
  defaultGame = 'quizz',
  onCreated,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  defaultGame?: GameKey
  onCreated?: () => void
}) {
  const { toast } = useToast()
  const [game, setGame] = React.useState<GameKey>(defaultGame)
  React.useEffect(() => setGame(defaultGame), [defaultGame])

  const [q, setQ] = React.useState('')
  const qDeb = useDebounced(q, 350)
  const [results, setResults] = React.useState<PickUser[]>([])
  const [loading, setLoading] = React.useState(false)
  const [selected, setSelected] = React.useState<PickUser | null>(null)
  const [score, setScore] = React.useState<number | ''>('')

  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    let cancel = false
    async function run() {
      if (!open) return
      if (!qDeb || qDeb.length < 2) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/game/users/search?q=${encodeURIComponent(qDeb)}`, {
          cache: 'no-store',
        })
        if (!res.ok) throw new Error('search failed')
        const json = await res.json()
        if (!cancel) setResults(json.users ?? [])
      } catch {
        if (!cancel) setResults([])
      } finally {
        if (!cancel) setLoading(false)
      }
    }
    run()
    return () => {
      cancel = true
    }
  }, [qDeb, open])

  async function createScore() {
    if (!selected || score === '' || Number.isNaN(Number(score))) {
      toast({ title: 'Champs manquants', description: 'Sélectionne un utilisateur et un score valide.', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/game/scores/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selected.id, game, score: Number(score) }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.message || 'Création impossible')
      }
      toast({ title: 'Score créé', description: 'Le score a été ajouté.' })
      onCreated?.()
      onOpenChange(false)
      setQ('')
      setSelected(null)
      setScore('')
    } catch (e: any) {
      toast({ title: 'Erreur', description: e?.message ?? 'Échec', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !saving && onOpenChange(v)}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Créer un score</DialogTitle>
          <DialogDescription>Choisissez le jeu, recherchez un utilisateur, puis saisissez un score.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Jeu</label>
            <Select value={game} onValueChange={(v) => setGame(v as GameKey)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner un jeu" /></SelectTrigger>
              <SelectContent>
                {GAME_OPTIONS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Utilisateur</label>
            <Input placeholder="Rechercher par nom, prénom ou email…" value={q} onChange={(e) => setQ(e.target.value)} />
            <div className="max-h-56 overflow-auto rounded border">
              {loading ? (
                <div className="p-3 text-sm text-muted-foreground">Recherche…</div>
              ) : results.length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground">
                  {q.length < 2 ? 'Tapez au moins 2 caractères.' : 'Aucun résultat.'}
                </div>
              ) : (
                <ul className="divide-y">
                  {results.map((u) => {
                    const label = `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email || 'Utilisateur'
                    return (
                      <li
                        key={u.id}
                        className={`px-3 py-2 cursor-pointer hover:bg-muted ${u.id === selected?.id ? 'bg-muted' : ''}`}
                        onClick={() => setSelected(u)}
                      >
                        <div className="font-medium">{label}</div>
                        <div className="text-xs text-muted-foreground">{u.email ?? '—'}</div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Score</label>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="Ex. 12"
              value={score}
              onChange={(e) => setScore(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>Annuler</Button>
          <Button className="bg-amber-600 hover:bg-amber-700" onClick={createScore} disabled={saving || !selected || score === ''}>
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
