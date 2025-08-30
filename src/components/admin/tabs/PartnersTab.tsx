// src/components/admin/tabs/PartnersTab.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

import * as React from 'react';

type Row = {
  id: string;
  name: string;
  website: string | null;
  active: boolean;
  order: number;
  logoUrl: string | null;
};

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function PartnersTab() {
  const { toast } = useToast();
  const [rows, setRows] = React.useState<Row[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [q, setQ] = React.useState('');
  const [page, setPage] = React.useState(1);
  const pageSize = 15;

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', website: '', logoUrl: '', order: 0 });

  React.useEffect(() => setPage(1), [q]);
  const qDebounced = useDebounced(q, 350);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/admin/partners?q=${encodeURIComponent(qDebounced)}&page=${page}&pageSize=${pageSize}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch failed');
      const json = await res.json();
      setRows(json.partners ?? []);
      setTotal(json.total ?? 0);
    } catch {
      toast({ title: 'Erreur', description: 'Chargement des partenaires impossible', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, qDebounced, toast]);

  React.useEffect(() => { load(); }, [load]);

  async function createPartner() {
    const res = await fetch('/api/admin/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        website: form.website?.trim() || null,
        logoUrl: form.logoUrl?.trim() || null,
        order: Number(form.order) || 0,
      }),
    });
    if (!res.ok) {
      toast({ title: 'Erreur', description: 'Création impossible', variant: 'destructive' });
      return;
    }
    setOpen(false);
    setForm({ name: '', website: '', logoUrl: '', order: 0 });
    load();
  }

  async function toggleActive(id: string, active: boolean) {
    const res = await fetch(`/api/admin/partners/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });
    if (!res.ok) {
      toast({ title: 'Erreur', description: 'Mise à jour impossible', variant: 'destructive' });
      return;
    }
    load();
  }

  async function remove(id: string) {
    if (!confirm('Supprimer ce partenaire ?')) return;
    const res = await fetch(`/api/admin/partners/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      toast({ title: 'Erreur', description: 'Suppression impossible', variant: 'destructive' });
      return;
    }
    load();
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CardTitle>Partenariats</CardTitle>
        <div className="flex gap-2">
          <Input
            placeholder="Rechercher un partenaire…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-64"
          />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">+ Nouveau partenaire</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un partenaire</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3">
                <Input placeholder="Nom *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                <Input placeholder="Site web (https…)" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} />
                <Input placeholder="Logo URL (https…)" value={form.logoUrl} onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))} />
                <Input type="number" placeholder="Ordre (0…)" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} />
                <Button onClick={createPartner} className="bg-amber-500 hover:bg-amber-600 text-white">Créer</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Site</TableHead>
                <TableHead className="text-center">Actif</TableHead>
                <TableHead>Ordre</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    {r.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.logoUrl} alt={r.name} className="h-8 w-auto" />
                    ) : (
                      <div className="h-8 w-8 rounded bg-muted" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>
                    {r.website ? (
                      <a href={r.website} target="_blank" className="text-amber-600 hover:underline" rel="noreferrer">
                        {new URL(r.website).hostname}
                      </a>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={r.active} onCheckedChange={(v) => toggleActive(r.id, v)} />
                  </TableCell>
                  <TableCell>{r.order}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="sm" onClick={() => remove(r.id)}>
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Aucun partenaire
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination simple */}
        <div className="mt-4 flex items-center justify-end gap-2 text-sm">
          <span className="text-muted-foreground">
            Page {page} / {Math.max(1, Math.ceil(total / pageSize))}
          </span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => (p * pageSize >= total ? p : p + 1))}
            disabled={page * pageSize >= total}
          >
            Suivant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
