"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export type RequestRow = {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  diplome: string;
  annee: number;
  statut: string;
};

export function makeRequestColumns(
  onApprove: (id: string) => void,
  onReject: (id: string) => void
): ColumnDef<RequestRow>[] {
  return [
    { header: "Nom", accessorKey: "lastName" },
    { header: "Prénom", accessorKey: "firstName" },
    { header: "Email", accessorKey: "email" },
    { header: "Diplôme", accessorKey: "diplome" },
    { header: "Année", accessorKey: "annee" },
    { header: "Statut", accessorKey: "statut" },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <Button size="sm" onClick={() => onApprove(row.original.id)}>Valider</Button>
          <Button size="sm" variant="outline" onClick={() => onReject(row.original.id)}>Refuser</Button>
        </div>
      ),
    },
  ];
}
