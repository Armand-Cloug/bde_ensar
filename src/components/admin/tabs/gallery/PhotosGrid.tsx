'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function PhotosGrid({
  photos,
  onChanged,
}: {
  photos: { id: string; imagePath: string }[];
  onChanged: () => void;
}) {
  const { toast } = useToast();

  async function remove(id: string) {
    if (!confirm('Supprimer cette photo ?')) return;
    try {
      const res = await fetch(`/api/admin/gallery/photos/${id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? 'Suppression échouée');
      onChanged();
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    }
  }

  if (!photos.length) return <p className="text-sm text-muted-foreground">Aucune photo pour le moment.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {photos.map((p) => (
        <div key={p.id} className="border rounded-md overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.imagePath} alt="" className="w-full h-40 object-cover" />
          <div className="p-2 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => remove(p.id)}
            >
              Supprimer
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
