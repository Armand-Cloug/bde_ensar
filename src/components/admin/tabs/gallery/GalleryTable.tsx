// src/components/admin/tabs/gallery/GalleryTable.tsx
'use client';

import type { GalleryEventRow } from './types';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

import * as React from 'react';
import GalleryRowActions from './GalleryRowActions';

function fmtDate(d: string) {
  return new Date(d).toLocaleString('fr-FR');
}

export default function GalleryTable({
  data,
  loading,
  onChanged,
}: {
  data: GalleryEventRow[];
  loading: boolean;
  onChanged: () => void;
}) {
  if (loading) return <p className="text-sm text-muted-foreground">Chargement…</p>;
  if (!data.length) return <p className="text-sm text-muted-foreground">Aucun événement de galerie.</p>;

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Actif</TableHead>
            <TableHead>Photos</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="font-medium">{e.title}</TableCell>
              <TableCell>{e.isActive ? 'Oui' : 'Non'}</TableCell>
              <TableCell>{e.photosCount}</TableCell>
              <TableCell>{fmtDate(e.createdAt)}</TableCell>
              <TableCell className="text-right">
                <GalleryRowActions row={e} onChanged={onChanged} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
