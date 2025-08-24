"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type PickUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
};

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function AddAdherentDialog({
  open,
  onOpenChange,
  onAdded,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdded?: () => void;
}) {
  const { toast } = useToast();
  const [q, setQ] = React.useState("");
  const qDebounced = useDebounced(q, 350);
  const [results, setResults] = React.useState<PickUser[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState<PickUser | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    let cancel = false;
    async function run() {
      if (!open) return;
      if (!qDebounced || qDebounced.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/adherents/search?q=${encodeURIComponent(qDebounced)}`, { cache: "no-store" });
        if (!res.ok) throw new Error("search failed");
        const json = await res.json();
        if (!cancel) setResults(json.users ?? []);
      } catch {
        if (!cancel) setResults([]);
      } finally {
        if (!cancel) setLoading(false);
      }
    }
    run();
    return () => { cancel = true; };
  }, [qDebounced, open]);

  async function grant() {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/adherents/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selected.id }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        const msg = j?.message || "Impossible d’attribuer le statut adhérent.";
        toast({ title: "Erreur", description: msg, variant: "destructive" });
        return;
      }
      toast({ title: "Adhérent attribué", description: "Le statut a été mis à jour." });
      onOpenChange(false);
      setQ("");
      setSelected(null);
      onAdded?.();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!saving) onOpenChange(v); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter un adhérent</DialogTitle>
          <DialogDescription>
            Recherchez un utilisateur (non adhérent), puis validez. Le paiement Stripe est bypassé.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Rechercher par nom, prénom ou email…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <div className="max-h-64 overflow-auto rounded border">
            {loading ? (
              <div className="p-3 text-sm text-muted-foreground">Recherche…</div>
            ) : results.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">
                {q.length < 2 ? "Tapez au moins 2 caractères." : "Aucun résultat."}
              </div>
            ) : (
              <ul className="divide-y">
                {results.map((u) => {
                  const label = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email || "Utilisateur";
                  return (
                    <li
                      key={u.id}
                      className={`px-3 py-2 cursor-pointer hover:bg-muted ${selected?.id === u.id ? "bg-muted" : ""}`}
                      onClick={() => setSelected(u)}
                    >
                      <div className="font-medium">{label}</div>
                      <div className="text-xs text-muted-foreground">{u.email ?? "—"}</div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            La période d’adhésion démarre maintenant et se termine au prochain 1ᵉʳ septembre.
          </p>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
            Annuler
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700" onClick={grant} disabled={!selected || saving}>
            Valider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
