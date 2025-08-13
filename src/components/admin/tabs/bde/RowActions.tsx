'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function RowActions({
  id,
  onActivated,
  onDeleted,
}: {
  id: string;
  onActivated?: () => void;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  async function activate() {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/bde/teams/${id}/activate`, { method: 'PATCH' });
      if (res.ok) {
        onActivated?.();
        // router.refresh(); // inutile si on fait une MAJ optimiste dans le parent
      }
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/bde/teams/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setConfirmOpen(false);
        onDeleted?.();
        // router.refresh(); // si tu préfères re-fetch global
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href={`/admin/bde/${id}`}>Voir détails</Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={activate} disabled={busy}>
            Définir comme active
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setConfirmOpen(true)}>
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce BDE ?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} disabled={busy}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
