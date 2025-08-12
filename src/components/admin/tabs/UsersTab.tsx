'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from './users/data-table';
import { columns, type UserRow } from './users/columns';
import * as React from 'react';

export default function UsersTab() {
  const [data, setData] = React.useState<UserRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/admin/users', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        // Adapte selon ta route: [{ id, firstName, lastName, email }, ...]
        const rows: UserRow[] = (json?.users ?? []).map((u: any) => ({
          id: String(u.id),
          firstName: u.firstName ?? null,
          lastName: u.lastName ?? null,
          email: u.email ?? null,
        }));
        if (!cancelled) setData(rows);
      } catch {
        // Fallback démo
        if (!cancelled)
          setData([
            { id: '1', lastName: 'Doe', firstName: 'John', email: 'john.doe@example.com' },
            { id: '2', lastName: 'Smith', firstName: 'Anna', email: 'anna.smith@example.com' },
          ]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-sm text-muted-foreground">Chargement…</div>
        ) : (
          <DataTable columns={columns} data={data} searchPlaceholder="Rechercher un nom ou un email…" />
        )}
      </CardContent>
    </Card>
  );
}
