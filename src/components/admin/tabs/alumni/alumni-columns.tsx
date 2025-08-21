"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem
} from "@/components/ui/dropdown-menu";

export type AlumniRow = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  diplome: string | null;
  annee: number | null;
};

export function makeAlumniColumns(onRemove: (userId: string) => void): ColumnDef<AlumniRow>[] {
  return [
    { header: "Nom", accessorKey: "lastName" },
    { header: "Prénom", accessorKey: "firstName" },
    { header: "Email", accessorKey: "email" },
    { header: "Diplôme", accessorKey: "diplome" },
    { header: "Année", accessorKey: "annee" },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onRemove(row.original.id)}>
              Retirer le statut alumni
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
