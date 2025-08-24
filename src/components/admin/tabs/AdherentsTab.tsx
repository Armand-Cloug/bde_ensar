'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTableServer } from './users/data-table-server';
import { columns, type AdherentRow } from './adherents/columns';
import AddAdherentDialog from './adherents/AddAdherentDialog';
import ResetAdherentsButton from './adherents/ResetAdherentsButton';

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function AdherentsTab() {
  const [data, setData] = React.useState<AdherentRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [q, setQ] = React.useState('');
  const [page, setPage] = React.useState(1);
  const pageSize = 15;
  const [total, setTotal] = React.useState(0);
  const [openAdd, setOpenAdd] = React.useState(false);

  React.useEffect(() => setPage(1), [q]);
  const qDebounced = useDebounced(q, 350);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/admin/adherents?q=${encodeURIComponent(qDebounced)}&page=${page}&pageSize=${pageSize}`;
      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();
      const rows: AdherentRow[] = (json?.adherents ?? []).map((u: any) => {
        const end = u.adhesionEnd ? new Date(u.adhesionEnd) : null;
        const now = new Date();
        const status: 'actif' | 'expiré' = end && end.getTime() >= now.getTime() ? 'actif' : 'expiré';
        return {
          id: String(u.id),
          firstName: u.firstName ?? null,
          lastName: u.lastName ?? null,
          email: u.email ?? null,
          adhesionStart: u.adhesionStart ?? null,
          adhesionEnd: u.adhesionEnd ?? null,
          status,
        };
      });
      setData(rows);
      setTotal(json?.total ?? rows.length);
    } finally {
      setLoading(false);
    }
  }, [qDebounced, page]);

  React.useEffect(() => { load(); }, [load]);

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle>Adhérents</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button className="bg-amber-600 hover:bg-amber-700" onClick={() => setOpenAdd(true)}>
            Ajouter un adhérent
          </Button>
          <ResetAdherentsButton onDone={load} />
        </div>
      </CardHeader>
      <CardContent>
        <DataTableServer
          columns={columns}
          data={data}
          searchValue={q}
          onSearchChange={setQ}
          isLoading={loading}
          page={page}
          pageSize={pageSize}
          total={total}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => (p * pageSize >= total ? p : p + 1))}
        />
      </CardContent>

      <AddAdherentDialog open={openAdd} onOpenChange={setOpenAdd} onAdded={load} />
    </Card>
  );
}
