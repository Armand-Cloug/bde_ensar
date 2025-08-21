// components/account/RequestAlumniButton.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Schema = z.object({
  diplome: z.string().min(1, "Diplôme requis"),
  anneeObtention: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 5),
});

type FormValues = z.infer<typeof Schema>;

export default function RequestAlumniButton({ isAlumni }: { isAlumni?: boolean }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),              
    defaultValues: {
      diplome: "",
      anneeObtention: new Date().getFullYear(),
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch("/api/alumni/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast({
          title: "Erreur",
          description: j?.error ?? "Impossible d’envoyer la demande.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Demande envoyée",
        description: "Votre demande Alumni a été transmise. Vous serez notifié(e) après validation.",
      });
      setOpen(false);
    } catch {
      toast({
        title: "Erreur",
        description: "Réseau indisponible.",
        variant: "destructive",
      });
    }
  }

  if (isAlumni) {
    return (
      <Button variant="outline" disabled className="cursor-default">
        Déjà Alumni
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-600 hover:bg-orange-700">Devenir Alumni</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Demander le statut Alumni</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-1">
            <Label htmlFor="diplome">Diplôme</Label>
            <Input
              id="diplome"
              placeholder="Ex. Ingénieur Agronome"
              {...form.register("diplome")}
            />
            {form.formState.errors.diplome && (
              <p className="text-sm text-red-500">{form.formState.errors.diplome.message}</p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="annee">Année d’obtention</Label>
            <Input
              id="annee"
              type="number"
              inputMode="numeric"
              // ✅ pour que RHF te donne bien un number (pas une string)
              {...form.register("anneeObtention", { valueAsNumber: true })}
            />
            {form.formState.errors.anneeObtention && (
              <p className="text-sm text-red-500">
                {form.formState.errors.anneeObtention.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Envoi..." : "Envoyer la demande"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
