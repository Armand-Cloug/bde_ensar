// components/admin/bde/MemberRowActions.tsx
'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export default function MemberRowActions({
  teamId,
  memberId,
  userId,
}: {
  teamId: string;
  memberId: string;
  userId: string;
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  async function onDelete() {
    const res = await fetch(`/api/admin/bde/teams/${teamId}/members/${memberId}`, { method: "DELETE" });
    if (res.ok) {
      setConfirmOpen(false);
      router.refresh();
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
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild>
            <Link href={`/admin/users/${userId}`}>Voir détail</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setConfirmOpen(true)}>
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retirer ce membre de l'équipe ?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
