// src/components/admin/tabs/adherents/columns.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import type { ColumnDef } from '@tanstack/react-table';

export type AdherentRow = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  adhesionStart: string | null; // ISO
  adhesionEnd: string | null;   // ISO
  status: 'actif' | 'expiré';
};

function formatFR(d: string | null) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('fr-FR');
  } catch {
    return '—';
  }
}

export const columns: ColumnDef<AdherentRow>[] = [
  {
    accessorKey: 'lastName',
    header: 'Nom',
    cell: ({ row }) => row.original.lastName ?? '—',
  },
  {
    accessorKey: 'firstName',
    header: 'Prénom',
    cell: ({ row }) => row.original.firstName ?? '—',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => row.original.email ?? '—',
  },
  {
    id: 'start',
    header: 'Début adhésion',
    cell: ({ row }) => formatFR(row.original.adhesionStart),
  },
  {
    id: 'end',
    header: 'Fin adhésion',
    cell: ({ row }) => formatFR(row.original.adhesionEnd),
  },
  {
    id: 'status',
    header: 'Statut',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'actif' ? 'default' : 'secondary'}>
        {row.original.status === 'actif' ? 'Actif' : 'Expiré'}
      </Badge>
    ),
  },
];
