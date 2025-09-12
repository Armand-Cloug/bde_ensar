// src/components/admin/tabs/gallery/CreateGalleryDialog.tsx
'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

import * as React from 'react';

export default function CreateGalleryDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isActive, setIsActive] = React.useState(false);
  const [coverImage, setCoverImage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function create() {
    if (!title.trim()) {
      toast({ title: 'Titre requis' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          isActive,
          coverImage: coverImage || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? 'Erreur création');
      }
      onCreated();
      onOpenChange(false);
      setTitle(''); setDescription(''); setIsActive(false); setCoverImage('');
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Créer un événement de galerie</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label>Titre *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label>Cover image (URL publique)</Label>
            <Input placeholder="https://…" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
            <Label htmlFor="isActive">Activer</Label>
          </div>

          <Button onClick={create} disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white">
            {loading ? 'Création…' : 'Créer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
