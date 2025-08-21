// components/admin/tabs/AdherentsTab.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableServer } from './users/data-table-server';
import { columns, type AdherentRow } from './adherents/columns';

// petit helper déjà utilisé ailleurs
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

  // reset page quand on lance une nouvelle recherche
  React.useEffect(() => setPage(1), [q]);
  const qDebounced = useDebounced(q, 350);

  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const url = `/api/admin/adherents?q=${encodeURIComponent(qDebounced)}&page=${page}&pageSize=${pageSize}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error('fetch adherents failed');

        const json = await res.json();

        const rows: AdherentRow[] = (json?.adherents ?? []).map((u: any) => {
          const end = u.adhesionEnd ? new Date(u.adhesionEnd) : null;
          const now = new Date();
          const status: 'actif' | 'expiré' =
            end && end.getTime() >= now.getTime() ? 'actif' : 'expiré';

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

        if (!cancelled) {
          setData(rows);
          setTotal(json?.total ?? rows.length);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [qDebounced, page]); // pageSize constant

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adhérents</CardTitle>
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
    </Card>
  );
}
