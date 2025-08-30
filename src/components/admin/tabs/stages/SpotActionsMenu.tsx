// src/components/admin/tabs/stages/SpotActionsMenu.tsx
'use client';

import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import EditSpotDialog from './EditSpotDialog';
import * as React from 'react';

type Props = {
  spotId: string;
  onEdited?: () => void;
  onDeleted?: () => void;
};

export default function SpotActionsMenu({ spotId, onEdited, onDeleted }: Props) {
  const { toast } = useToast();
  const [openEdit, setOpenEdit] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  async function handleDelete() {
    if (!confirm('Supprimer ce point de stage ?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/internships/spots/${spotId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('delete');
      onDeleted?.();
      toast({ title: 'Supprimé', description: 'Le point a été supprimé.' });
    } catch {
      toast({ title: 'Erreur', description: 'Suppression impossible', variant: 'destructive' });
    } finally {
      setDeleting(false);
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
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Pencil className="h-4 w-4 mr-2" /> Modifier
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" /> Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditSpotDialog
        spotId={spotId}
        open={openEdit}
        onOpenChange={setOpenEdit}
        onSaved={onEdited}
      />
    </>
  );
}
