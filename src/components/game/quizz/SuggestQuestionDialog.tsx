'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const CATS = [
  { value: 'general', label: 'Général' },
  { value: 'qse',     label: 'QSE' },
  { value: 'data',    label: 'Data' },
  { value: 'ssi',     label: 'SSI' },
] as const;

const DIFFS = [
  { value: 'facile',    label: 'Facile' },
  { value: 'moyen',     label: 'Moyen' },
  { value: 'difficile', label: 'Difficile' },
] as const;

export default function SuggestQuestionDialog() {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = React.useState('general');
  const [difficulty, setDifficulty] = React.useState('facile');
  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  async function submit() {
    if (!question.trim() || !answer.trim()) {
      toast({ title: 'Champs requis', description: 'Question et réponse sont obligatoires.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/game/quizz/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, difficulty, question, answer }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || "Impossible d'envoyer la question");
      }
      toast({ title: 'Merci !', description: 'Ta question a été envoyée et attend validation.' });
      setOpen(false);
      setQuestion(''); setAnswer('');
      setCategory('general'); setDifficulty('facile');
    } catch (e: any) {
      toast({ title: 'Erreur', description: e?.message ?? 'Échec', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !saving && setOpen(v)}>
      <DialogTrigger asChild>
        <Button variant="outline">Proposer une question</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Proposer une question</DialogTitle>
          <DialogDescription>
            Elle sera revue par un admin. Les points seront attribués lors de la validation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">Catégorie</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger>
                <SelectContent>
                  {CATS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">Difficulté</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue placeholder="Difficulté" /></SelectTrigger>
                <SelectContent>
                  {DIFFS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Question</label>
            <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Écris ta question…" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Réponse</label>
            <Input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Réponse exacte" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={saving}>Annuler</Button>
          <Button className="bg-amber-600 hover:bg-amber-700" onClick={submit} disabled={saving}>Envoyer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
