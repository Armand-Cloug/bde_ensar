// src/components/admin/tabs/gallery/GalleryEventDetailsDialog.tsx
'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

import * as React from 'react';
import PhotosGrid from './PhotosGrid';

export default function GalleryEventDetailsDialog({
  open,
  onOpenChange,
  id,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  id: string;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [coverImage, setCoverImage] = React.useState('');
  const [isActive, setIsActive] = React.useState(false);

  const [photos, setPhotos] = React.useState<{ id: string; imagePath: string }[]>([]);
  const [hasRights, setHasRights] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [files, setFiles] = React.useState<FileList | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery/events/${id}`);
      if (!res.ok) throw new Error('Chargement impossible');
      const json = await res.json();
      const ev = json?.event;
      setTitle(ev?.title ?? '');
      setDescription(ev?.description ?? '');
      setCoverImage(ev?.coverImage ?? '');
      setIsActive(Boolean(ev?.isActive));
      setPhotos((ev?.photos ?? []).map((p: any) => ({ id: p.id, imagePath: p.imagePath })));
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { if (open) load(); }, [open]);

  async function saveInfo() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/gallery/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          isActive,
          coverImage: coverImage || null,
        }),
      });
      if (!res.ok) throw new Error('Sauvegarde échouée');
      onSaved();
      toast({ title: 'OK', description: 'Événement mis à jour' });
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  async function upload() {
    if (!files || !files.length) {
      toast({ title: 'Aucun fichier sélectionné' });
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append('files', f));
      fd.append('hasImageRights', String(hasRights));

      const res = await fetch(`/api/admin/gallery/events/${id}/upload`, {
        method: 'POST',
        body: fd,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? 'Upload échoué');

      toast({ title: 'OK', description: `${(json?.created ?? []).length} photo(s) ajoutée(s)` });
      setFiles(null);
      await load();
      onSaved();
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Détails de la galerie</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement…</p>
        ) : (
          <div className="grid gap-6">
            {/* Form infos */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <div>
                  <Label>Titre</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                  <Label>Cover image (URL publique)</Label>
                  <Input placeholder="https://…" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={isActive} onCheckedChange={setIsActive} id="active" />
                  <Label htmlFor="active">Activer</Label>
                </div>
                <div>
                  <Button onClick={saveInfo} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-white">
                    {saving ? 'Enregistrement…' : 'Enregistrer'}
                  </Button>
                </div>
              </div>

              {/* Upload */}
              <div className="grid gap-3">
                <div>
                  <Label>Ajouter des photos (jpg, jpeg, png, webp — ≤ 25 Mo)</Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setFiles(e.target.files)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Jusqu’à 100 fichiers par lot, 1000 photos max / événement, 2 Go au total.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={hasRights} onCheckedChange={setHasRights} id="rights" />
                  <Label htmlFor="rights" className="text-sm">
                    J’atteste disposer des droits d’image (aucune donnée privée, seulement des infos publiques).
                  </Label>
                </div>
                <div>
                  <Button onClick={upload} disabled={uploading} className="bg-amber-500 hover:bg-amber-600 text-white">
                    {uploading ? 'Upload en cours…' : 'Uploader'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Grille photos */}
            <PhotosGrid photos={photos} onChanged={load} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
