'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void; // reload
};

export default function CreateEventDialog({ open, onOpenChange, onCreated }: Props) {
  const { toast } = useToast();
  const [form, setForm] = React.useState({
    title: '',
    date: '',
    location: '',
    inscriptionLink: '',
    image: '',
    isActive: false,
    description: '',
  });
  const [loading, setLoading] = React.useState(false);

  async function submit() {
    if (!form.title || !form.date || !form.description) {
      toast({ title: 'Champs manquants', description: 'Nom, date et description sont requis.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || 'Création impossible');
      }
      onOpenChange(false);
      setForm({
        title: '',
        date: '',
        location: '',
        inscriptionLink: '',
        image: '',
        isActive: false,
        description: '',
      });
      onCreated();
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Créer un évènement</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label>Nom *</Label>
            <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <Label>Date *</Label>
            <Input
              type="datetime-local"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
          <div>
            <Label>Lieu</Label>
            <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
          </div>
          <div>
            <Label>Lien d’inscription</Label>
            <Input
              placeholder="https://…"
              value={form.inscriptionLink}
              onChange={(e) => setForm((f) => ({ ...f, inscriptionLink: e.target.value }))}
            />
          </div>
          <div>
            <Label>Image (URL)</Label>
            <Input
              placeholder="https://…"
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            />
          </div>
          <div>
            <Label>Description *</Label>
            <Textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Actif</Label>
            <Switch
              checked={form.isActive}
              onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
            />
          </div>

          <Button
            onClick={submit}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            {loading ? 'Création…' : 'Créer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
