// src/components/admin/tabs/StagesTab.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

import * as React from 'react';
import SpotActionsMenu from './stages/SpotActionsMenu';
import SpotForm from './stages/SpotForm';

type SpotRow = {
  id: string;
  title: string;
  companyName: string;
  city?: string | null;
  countryCode: string;
  approved: boolean;
};

export default function StagesTab() {
  const { toast } = useToast();
  const [rows, setRows] = React.useState<SpotRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/internships/spots?approved=0', { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch');
      const json = await res.json();
      const mapped = (json.spots ?? []).map((s: any) => ({
        id: s.id,
        title: s.title,
        companyName: s.companyName,
        city: s.city,
        countryCode: s.countryCode,
        approved: s.approved,
      })) as SpotRow[];
      setRows(mapped);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const toggleApprove = async (id: string, value: boolean) => {
    const res = await fetch(`/api/internships/spots/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: value }),
    });
    if (!res.ok) {
      toast({ title: 'Erreur', description: 'Mise à jour impossible', variant: 'destructive' });
      return;
    }
    setRows((r) => r.map((x) => (x.id === id ? { ...x, approved: value } : x)));
  };

  const remove = async (id: string) => {
    if (!confirm('Supprimer ce point ?')) return;
    const res = await fetch(`/api/internships/spots/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      toast({ title: 'Erreur', description: 'Suppression impossible', variant: 'destructive' });
      return;
    }
    setRows((r) => r.filter((x) => x.id !== id));
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un point (Stages)</CardTitle>
        </CardHeader>
        <CardContent>
          <SpotForm onCreated={load} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modération (approuver / modifier / supprimer)</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left">
                <th className="px-4 py-2">Titre</th>
                <th className="px-4 py-2">Organisation</th>
                <th className="px-4 py-2">Ville</th>
                <th className="px-4 py-2">Pays</th>
                <th className="px-4 py-2">Approuvé</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4" colSpan={6}>
                    Chargement...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-4" colSpan={6}>
                    Aucun point à afficher.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="px-4 py-2">{r.title}</td>
                    <td className="px-4 py-2">{r.companyName}</td>
                    <td className="px-4 py-2">{r.city ?? '—'}</td>
                    <td className="px-4 py-2">{r.countryCode}</td>
                    <td className="px-4 py-2">
                      <Switch checked={r.approved} onCheckedChange={(v) => toggleApprove(r.id, v)} />
                    </td>
                    <td className="px-4 py-2 text-right">
                      <SpotActionsMenu
                        spotId={r.id}
                        onEdited={load}
                        onDeleted={() => remove(r.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
