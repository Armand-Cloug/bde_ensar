// src/components/admin/tabs/users/columns.tsx
'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Link from 'next/link';

export type UserRow = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
};

export const columns: ColumnDef<UserRow>[] = [
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
    id: 'actions',
    header: '',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              aria-label="Actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${id}`}>Afficher détails</Link>
            </DropdownMenuItem>
            {/* autres actions plus tard */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
