'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

const CATEGORIES = [
  { value: 'general', label: 'Général' },
  { value: 'qse',     label: 'QSE' },
  { value: 'data',    label: 'Data' },
  { value: 'ssi',     label: 'SSI' },
] as const

const DIFF = [
  { value: 'easy', label: 'Facile' },
  { value: 'medium', label: 'Moyen' },
  { value: 'hard', label: 'Difficile' },
] as const

export default function CreateQuestionDialog({
  open, onOpenChange, onCreated,
}: { open: boolean; onOpenChange: (v: boolean) => void; onCreated?: () => void }) {
  const { toast } = useToast()
  const [category, setCategory] = React.useState<string>('general')
  const [difficulty, setDifficulty] = React.useState<string>('easy')
  const [question, setQuestion] = React.useState('')
  const [answer, setAnswer] = React.useState('')
  const [saving, setSaving] = React.useState(false)

  async function createQ() {
    if (!question.trim() || !answer.trim()) {
      toast({ title: 'Champs requis', description: 'Question et réponse sont obligatoires.', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/game/admin/quizz/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, difficulty, question, answer }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.message || 'Création impossible')
      }
      toast({ title: 'Question créée', description: 'En attente de validation.' })
      onCreated?.()
      onOpenChange(false)
      setQuestion(''); setAnswer('')
      setCategory('general'); setDifficulty('easy')
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
          <DialogTitle>Créer une question</DialogTitle>
          <DialogDescription>La question sera ajoutée à la file d’attente. Les points seront attribués lors de la validation.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">Catégorie</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">Difficulté</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue placeholder="Difficulté" /></SelectTrigger>
                <SelectContent>
                  {DIFF.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Question</label>
            <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Écris la question…"/>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Réponse</label>
            <Input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Réponse exacte" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>Annuler</Button>
          <Button className="bg-amber-600 hover:bg-amber-700" onClick={createQ} disabled={saving}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
