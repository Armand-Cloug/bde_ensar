'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GalleryEventRow } from './types';
import GalleryEventDetailsDialog from './GalleryEventDetailsDialog';

export default function GalleryRowActions({
  row,
  onChanged,
}: {
  row: GalleryEventRow;
  onChanged: () => void;
}) {
  const { toast } = useToast();
  const [openDetails, setOpenDetails] = React.useState(false);

  async function toggleActive() {
    try {
      const res = await fetch(`/api/admin/gallery/events/${row.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !row.isActive }),
      });
      if (!res.ok) throw new Error('Toggle échoué');
      onChanged();
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    }
  }

  async function remove() {
    if (!confirm('Supprimer cet événement et toutes ses photos ?')) return;
    try {
      const res = await fetch(`/api/admin/gallery/events/${row.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Suppression échouée');
      onChanged();
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setOpenDetails(true)}>Voir détails</DropdownMenuItem>
          <DropdownMenuItem onClick={toggleActive}>
            {row.isActive ? 'Désactiver' : 'Activer'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600" onClick={remove}>
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <GalleryEventDetailsDialog
        open={openDetails}
        onOpenChange={setOpenDetails}
        id={row.id}
        onSaved={onChanged}
      />
    </>
  );
}
