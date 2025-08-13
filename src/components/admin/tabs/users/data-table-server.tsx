'use client';

import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

type Props<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchValue: string;
  onSearchChange: (v: string) => void;
  isLoading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};

export function DataTableServer<TData, TValue>({
  columns,
  data,
  searchValue,
  onSearchChange,
  isLoading,
  page,
  pageSize,
  total,
  onPrev,
  onNext,
}: Props<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const maxPage = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-3">
      {/* Recherche (côté serveur) */}
      <div className="flex items-center gap-2">
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un nom ou un email…"
          className="max-w-xs"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Chargement…
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun résultat
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination serveur */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-muted-foreground">
          Page {page} / {maxPage} — {total} résultat{total > 1 ? 's' : ''}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPrev} disabled={page <= 1}>
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={page >= maxPage}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
