'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import FormationTree from './anal/FormationTree';
import { CreateFormationDialog } from './anal/CreateDialogs';
import type { FormationNode } from './anal/types';

export default function AnalTab() {
  const { toast } = useToast();
  const [tree, setTree] = React.useState<FormationNode[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [openCreateFormation, setOpenCreateFormation] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/anal/tree', { cache: 'no-store' });
      if (!res.ok) throw new Error('Impossible de charger la structure');
      const json = await res.json();
      setTree(json?.formations ?? []);
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => { load(); }, [load]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Anal — Formations & cours</CardTitle>
        <Button
          onClick={() => setOpenCreateFormation(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          + Ajouter une formation
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement…</p>
        ) : tree.length ? (
          <FormationTree data={tree} onChanged={load} />
        ) : (
          <p className="text-sm text-muted-foreground">Aucune formation.</p>
        )}
      </CardContent>

      <CreateFormationDialog
        open={openCreateFormation}
        onOpenChange={setOpenCreateFormation}
        onCreated={load}
      />
    </Card>
  );
}
