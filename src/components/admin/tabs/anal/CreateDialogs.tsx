// src/components/admin/tabs/anal/CreateDialogs.tsx
'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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

/* -------- Formation -------- */

export function CreateFormationDialog({
  open, onOpenChange, onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const { toast } = useToast();
  const [nom, setNom] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function create() {
    if (!nom.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/anal/formations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom }),
      });
      if (!res.ok) throw new Error('Création impossible');
      onCreated();
      onOpenChange(false);
      setNom('');
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Ajouter une formation</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label>Nom *</Label>
            <Input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Informatique" />
          </div>
          <Button onClick={create} disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-white">
            {loading ? 'Création…' : 'Créer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------- Semestre -------- */

export function CreateSemestreDialog({
  formationId, open, onOpenChange, onCreated,
}: {
  formationId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const { toast } = useToast();
  const [semestre, setSemestre] = React.useState('S5');
  const [loading, setLoading] = React.useState(false);

  async function create() {
    if (!semestre.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/anal/semestres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formationId, semestre }),
      });
      if (!res.ok) throw new Error('Création impossible');
      onCreated();
      onOpenChange(false);
      setSemestre('S5');
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Ajouter un semestre</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label>Semestre *</Label>
            <Input value={semestre} onChange={(e) => setSemestre(e.target.value)} placeholder="S5, S6, ..." />
          </div>
          <Button onClick={create} disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-white">
            {loading ? 'Création…' : 'Créer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------- UE -------- */

export function CreateUeDialog({
  semestreId, open, onOpenChange, onCreated,
}: {
  semestreId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const { toast } = useToast();
  const [ueNumber, setUeNumber] = React.useState(1);
  const [nomUe, setNomUe] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function create() {
    if (ueNumber < 1 || ueNumber > 5) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/anal/ues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ semestreId, ueNumber, nomUe: nomUe || null }),
      });
      if (!res.ok) throw new Error('Création impossible');
      onCreated();
      onOpenChange(false);
      setUeNumber(1); setNomUe('');
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Ajouter une UE</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label>Numéro d’UE (1–5) *</Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={ueNumber}
              onChange={(e) => setUeNumber(Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Nom d’UE (facultatif)</Label>
            <Input value={nomUe} onChange={(e) => setNomUe(e.target.value)} />
          </div>
          <Button onClick={create} disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-white">
            {loading ? 'Création…' : 'Créer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------- Matière -------- */

export function CreateMatiereDialog({
  ueId, open, onOpenChange, onCreated,
}: {
  ueId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const { toast } = useToast();
  const [nomMatiere, setNomMatiere] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function create() {
    if (!nomMatiere.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/anal/matieres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ueId, nomMatiere }),
      });
      if (!res.ok) throw new Error('Création impossible');
      onCreated();
      onOpenChange(false);
      setNomMatiere('');
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Ajouter une matière</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label>Nom de la matière *</Label>
            <Input value={nomMatiere} onChange={(e) => setNomMatiere(e.target.value)} />
          </div>
          <Button onClick={create} disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-white">
            {loading ? 'Création…' : 'Créer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------- Cours (upload) -------- */

export function CreateCoursDialog({
  matiereId, open, onOpenChange, onCreated,
}: {
  matiereId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function create() {
    if (!title.trim() || !file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      if (description) fd.append('description', description);
      fd.append('file', file);

      const res = await fetch(`/api/admin/anal/matieres/${matiereId}/cours`, {
        method: 'POST',
        body: fd,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? 'Upload impossible');

      onCreated();
      onOpenChange(false);
      setTitle(''); setDescription(''); setFile(null);
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader><DialogTitle>Ajouter un cours</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label>Titre *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label>Fichier (PDF uniquement, ≤ 25 Mo)</Label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <Button onClick={create} disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-white">
            {loading ? 'Envoi…' : 'Créer le cours'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
