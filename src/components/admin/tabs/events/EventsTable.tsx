// src/components/admin/tabs/events/EventsTable.tsx
'use client';

import { EventRow } from './types';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

import {
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
} from '@/components/ui/table';

type Props = {
  rows: EventRow[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onToggleActive: (id: string, active: boolean) => void;
  onEdit: (id: string) => void;
  onOpenPage: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function EventsTable({
  rows,
  loading,
  page,
  pageSize,
  total,
  onPrev,
  onNext,
  onToggleActive,
  onEdit,
  onOpenPage,
  onDelete,
}: Props) {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead className="text-center">Actif</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.title}</TableCell>
                <TableCell>{formatDate(r.date)}</TableCell>
                <TableCell>{r.location ?? '—'}</TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={r.isActive}
                    onCheckedChange={(v) => onToggleActive(r.id, v)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(r.id)}>
                        Voir / Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onOpenPage(r.id)}>
                        Gérer la page
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(r.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Aucun évènement
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-end gap-2 text-sm">
        <span className="text-muted-foreground">
          Page {page} / {Math.max(1, Math.ceil(total / pageSize))}
        </span>
        <Button variant="outline" size="sm" onClick={onPrev} disabled={page <= 1}>
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={page * pageSize >= total}
        >
          Suivant
        </Button>
      </div>
    </>
  );
}
