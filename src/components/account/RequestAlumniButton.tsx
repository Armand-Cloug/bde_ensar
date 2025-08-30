// src/components/account/RequestAlumniButton.tsx
'use client';

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import * as React from "react";
import * as z from "zod";

const Schema = z.object({
  diplome: z.string().min(1, "Diplôme requis"),
  anneeObtention: z.coerce
    .number()
    .int()
    .min(1950, "Année invalide")
    .max(new Date().getFullYear() + 5, "Année trop grande"),
});

type FormValues = z.infer<typeof Schema>;

type Props = {
  /** Si l’utilisateur est déjà Alumni, on désactive le bouton */
  isAlumni?: boolean;
};

export default function RequestAlumniButton({ isAlumni }: Props) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  // Cast du resolver pour éviter le "unknown is not assignable to number"
  const resolver = zodResolver(Schema) as unknown as Resolver<FormValues>;

  const form = useForm<FormValues>({
    resolver,
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
        description:
          "Votre demande Alumni a été transmise. Vous serez notifié(e) après validation.",
      });
      setOpen(false);
      form.reset();
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
        <Button className="bg-orange-600 hover:bg-orange-700">
          Devenir Alumni
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Demander le statut Alumni</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4"
          noValidate
        >
          <div className="grid gap-1">
            <Label htmlFor="diplome">Diplôme</Label>
            <Input
              id="diplome"
              placeholder="Ex. Ingénieur Agronome"
              {...form.register("diplome")}
            />
            {form.formState.errors.diplome && (
              <p className="text-sm text-red-500">
                {form.formState.errors.diplome.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="annee">Année d’obtention</Label>
            <Input
              id="annee"
              type="number"
              inputMode="numeric"
              // pour que RHF fournisse bien un number (pas string)
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
