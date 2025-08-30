// src/components/admin/tabs/BdeTab.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import * as React from 'react';
import RowActions from './bde/RowActions';
import CreateBdeButton from './bde/CreateBdeButton';

type TeamRow = {
  id: string;
  annee: string;
  description: string;
  image: string | null;
  createdAt: string;    // ISO string
  membersCount: number;
  isActive: boolean;
};

export default function BdeTab() {
  const [rows, setRows] = React.useState<TeamRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/bde/teams', { cache: 'no-store' });
        if (!res.ok) throw new Error('fetch teams failed');
        const json = await res.json();
        if (!cancel) setRows(json.teams ?? []);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  async function setActive(id: string) {
    const res = await fetch(`/api/admin/bde/teams/${id}/activate`, { method: 'PATCH' });
    if (res.ok) {
      // Optimistic update
      setRows(prev => prev.map(r => ({ ...r, isActive: r.id === id })));
    }
  }

  function handleDeleted(id: string) {
    setRows(prev => prev.filter(r => r.id !== id));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>BDE</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Active</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Membres</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead className="w-10 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Chargement…
                  </TableCell>
                </TableRow>
              ) : rows.length ? (
                rows.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      {t.isActive ? (
                        <Badge>Active</Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActive(t.id)}
                        >
                          Définir active
                        </Button>
                      )}
                    </TableCell>

                    <TableCell className="font-medium">{t.annee}</TableCell>

                    <TableCell
                      className="max-w-[420px] truncate"
                      title={t.description}
                    >
                      {t.description}
                    </TableCell>

                    <TableCell className="text-center">
                      {t.membersCount}
                    </TableCell>

                    <TableCell>
                      {new Date(t.createdAt).toLocaleDateString('fr-FR')}
                    </TableCell>

                    <TableCell className="text-right">
                      <RowActions
                        id={t.id}
                        onActivated={() => setActive(t.id)}
                        onDeleted={() => handleDeleted(t.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucun BDE pour le moment
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end">
          <CreateBdeButton />
        </div>
      </CardContent>
    </Card>
  );
}
