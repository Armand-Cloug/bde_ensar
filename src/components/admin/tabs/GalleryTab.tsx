'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import CreateGalleryDialog from './gallery/CreateGalleryDialog';
import GalleryTable from './gallery/GalleryTable';
import type { GalleryEventRow } from './gallery/types';

export default function GalleryTab() {
  const { toast } = useToast();
  const [openCreate, setOpenCreate] = React.useState(false);
  const [rows, setRows] = React.useState<GalleryEventRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery/events', { cache: 'no-store' });
      if (!res.ok) throw new Error('Fetch failed');
      const json = await res.json();
      const mapped: GalleryEventRow[] = (json?.events ?? []).map((e: any) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        isActive: e.isActive,
        coverImage: e.coverImage,
        createdAt: e.createdAt,
        photosCount: e._count?.photos ?? 0,
      }));
      setRows(mapped);
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Galerie</CardTitle>
        <Button
          onClick={() => setOpenCreate(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          + Créer un événement
        </Button>
      </CardHeader>
      <CardContent>
        <GalleryTable data={rows} loading={loading} onChanged={load} />
      </CardContent>

      <CreateGalleryDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreated={load}
      />
    </Card>
  );
}
