"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function ResetAdherentsButton({ onDone }: { onDone?: () => void }) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function runReset() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/adherents/reset", { method: "POST" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || "Échec de la réinitialisation");
      }

      // Récupération du nom de fichier dans Content-Disposition si présent
      const cd = res.headers.get("content-disposition") || "";
      let filename = "adherents-reset.txt";
      const m = cd.match(/filename="?([^"]+)"?/i);
      if (m?.[1]) filename = m[1];

      // Téléchargement du .txt
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast({ title: "Réinitialisation effectuée", description: "Le fichier des adhérents réinitialisés a été téléchargé." });
      onDone?.();
    } catch (e: any) {
      toast({ title: "Erreur", description: e?.message ?? "Réinitialisation impossible", variant: "destructive" });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !loading && setOpen(v)}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Réinitialiser les adhérents</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la réinitialisation</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action va retirer le statut <strong>adhérent</strong> de tous les utilisateurs actuellement adhérents.
            Un fichier texte listant les personnes impactées sera téléchargé. Continuer ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={runReset} disabled={loading} className="bg-amber-600 hover:bg-amber-700">
            Oui, réinitialiser
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
