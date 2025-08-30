// src/components/admin/tabs/events/EditEventDialog.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

import * as React from 'react';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  id: string;
  onSaved: () => void; // reload
};

export default function EditEventDialog({ open, onOpenChange, id, onSaved }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState<any>(null);

  // charge l'event quand on ouvre
  React.useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/events/${id}`);
        if (!res.ok) throw new Error('Chargement impossible');
        const json = await res.json();
        const ev = json.event;
        setForm({
          title: ev.title ?? '',
          date: ev.date ? new Date(ev.date).toISOString().slice(0, 16) : '',
          location: ev.location ?? '',
          inscriptionLink: ev.inscriptionLink ?? '',
          image: ev.image ?? '',
          isActive: Boolean(ev.isActive),
          description: ev.description ?? '',
        });
      } catch (e: any) {
        toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
        onOpenChange(false);
      }
    })();
  }, [open, id, toast, onOpenChange]);

  async function save() {
    if (!form) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        date: form.date ? new Date(form.date).toISOString() : undefined,
      };
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Mise à jour impossible');
      onOpenChange(false);
      onSaved();
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
          <DialogTitle>Modifier l’évènement</DialogTitle>
        </DialogHeader>
        {!form ? (
          <p className="text-sm text-muted-foreground">Chargement…</p>
        ) : (
          <div className="grid gap-3">
            <div>
              <Label>Nom</Label>
              <Input value={form.title} onChange={(e) => setForm((f: any) => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="datetime-local"
                value={form.date}
                onChange={(e) => setForm((f: any) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div>
              <Label>Lieu</Label>
              <Input value={form.location} onChange={(e) => setForm((f: any) => ({ ...f, location: e.target.value }))} />
            </div>
            <div>
              <Label>Lien d’inscription</Label>
              <Input
                placeholder="https://…"
                value={form.inscriptionLink}
                onChange={(e) => setForm((f: any) => ({ ...f, inscriptionLink: e.target.value }))}
              />
            </div>
            <div>
              <Label>Image (URL)</Label>
              <Input
                placeholder="https://…"
                value={form.image}
                onChange={(e) => setForm((f: any) => ({ ...f, image: e.target.value }))}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f: any) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Actif</Label>
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm((f: any) => ({ ...f, isActive: v }))}
              />
            </div>

            <Button onClick={save} disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-white">
              {loading ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
