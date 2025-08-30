// src/components/admin/tabs/EventsTab.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { EventRow } from './events/types';
import { useDebounced } from './events/useDebounced';

import * as React from 'react';
import HeaderBar from './events/HeaderBar';
import EventsTable from './events/EventsTable';
import CreateEventDialog from './events/CreateEventDialog';
import EditEventDialog from './events/EditEventDialog';
import EventPageDialog from './events/EventPageDialog';

export default function EventsTab() {
  const { toast } = useToast();

  const [rows, setRows] = React.useState<EventRow[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const [q, setQ] = React.useState('');
  const qDebounced = useDebounced(q, 350);

  const [page, setPage] = React.useState(1);
  const pageSize = 15;

  const [openCreate, setOpenCreate] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [pageId, setPageId] = React.useState<string | null>(null);
  const [openPage, setOpenPage] = React.useState(false);

  React.useEffect(() => setPage(1), [q]);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/admin/events?q=${encodeURIComponent(qDebounced)}&page=${page}&pageSize=${pageSize}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch failed');
      const json = await res.json();
      setRows(json.events ?? []);
      setTotal(json.total ?? 0);
    } catch {
      toast({ title: 'Erreur', description: 'Chargement des événements impossible', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, qDebounced, toast]);

  React.useEffect(() => { load(); }, [load]);

  async function onToggleActive(id: string, active: boolean) {
    const res = await fetch(`/api/admin/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: active }),
    });
    if (!res.ok) {
      toast({ title: 'Erreur', description: 'Mise à jour du statut impossible', variant: 'destructive' });
      return;
    }
    load();
  }

  async function onDelete(id: string) {
    if (!confirm('Supprimer cet événement ?')) return;
    const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      toast({ title: 'Erreur', description: 'Suppression impossible', variant: 'destructive' });
      return;
    }
    load();
  }

  function openEditDialog(id: string) {
    setEditId(id);
    setOpenEdit(true);
  }

  function openPageDialog(id: string) {
    setPageId(id);
    setOpenPage(true);
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CardTitle>Événements</CardTitle>
        <HeaderBar
          searchValue={q}
          onSearchChange={setQ}
          onOpenCreate={() => setOpenCreate(true)}
        />
      </CardHeader>

      <CardContent>
        <EventsTable
          rows={rows}
          loading={loading}
          page={page}
          pageSize={pageSize}
          total={total}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => (p * pageSize >= total ? p : p + 1))}
          onToggleActive={onToggleActive}
          onEdit={openEditDialog}
          onOpenPage={openPageDialog}
          onDelete={onDelete}
        />
      </CardContent>

      {/* Dialogs */}
      <CreateEventDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreated={load}
      />
      {editId && (
        <EditEventDialog
          open={openEdit}
          onOpenChange={setOpenEdit}
          id={editId}
          onSaved={load}
        />
      )}
      {pageId && (
        <EventPageDialog
          open={openPage}
          onOpenChange={setOpenPage}
          id={pageId}
          onSaved={() => {}}
        />
      )}
    </Card>
  );
}
