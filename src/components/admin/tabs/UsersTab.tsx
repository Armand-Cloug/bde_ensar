'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableServer } from './users/data-table-server';
import { columns, type UserRow } from './users/columns';

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function UsersTab() {
  const [data, setData] = React.useState<UserRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [q, setQ] = React.useState('');
  const [page, setPage] = React.useState(1);
  const pageSize = 15;
  const [total, setTotal] = React.useState(0);

  // reset page quand on tape une recherche
  React.useEffect(() => {
    setPage(1);
  }, [q]);

  const qDebounced = useDebounced(q, 350);

  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const url = `/api/admin/users?q=${encodeURIComponent(qDebounced)}&page=${page}&pageSize=${pageSize}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();

        const rows: UserRow[] = (json?.users ?? []).map((u: any) => ({
          id: String(u.id),
          firstName: u.firstName ?? null,
          lastName: u.lastName ?? null,
          email: u.email ?? null,
        }));

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
  }, [qDebounced, page]); // pageSize fixe ici

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utilisateurs</CardTitle>
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
