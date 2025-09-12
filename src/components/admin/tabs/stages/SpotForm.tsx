"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import * as z from "zod";
import type { Resolver } from "react-hook-form";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Schema = z.object({
  title: z.string().min(2),
  companyName: z.string().min(2),
  address: z.string().min(3),
  city: z.string().optional(),
  countryCode: z.string().min(2).max(2),
  countryName: z.string().optional(),
  // Autoriser la saisie vide dans l'input, mais exiger un nombre au submit
  lat: z
    .union([z.number().finite(), z.undefined()])
    .refine((v) => typeof v === "number" && Number.isFinite(v), {
      message: "Latitude requise",
    }),
  lng: z
    .union([z.number().finite(), z.undefined()])
    .refine((v) => typeof v === "number" && Number.isFinite(v), {
      message: "Longitude requise",
    }),
  contactEmail: z.string().email().optional(),
  website: z.string().url().optional(),
  description: z.string().max(2000).optional(),
});

type FormValues = z.infer<typeof Schema>;

export default function SpotForm({ onCreated }: { onCreated?: () => void }) {
  const { toast } = useToast();

  // Resolver typé (selon versions RHF/Zod)
  const resolver = zodResolver(Schema) as unknown as Resolver<FormValues>;

  const form = useForm<FormValues>({
    resolver,
    defaultValues: {
      title: "",
      companyName: "",
      address: "",
      city: "",
      countryCode: "FR",
      countryName: "France",
      lat: 48.8566,
      lng: 2.3522,
      contactEmail: "",
      website: "",
      description: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const res = await fetch("/api/internships/spots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      toast({
        title: "Échec",
        description: "Création impossible",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Créé",
      description: "Point ajouté. En attente de validation.",
    });
    form.reset();
    onCreated?.();
  };

  // Permettre de vider l'input number : si champ vide => undefined (pas 0/NaN)
  const toNumberChange =
    (onChange: (v: number | undefined) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      onChange(raw === "" ? undefined : Number(raw));
    };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 md:grid-cols-2"
      >
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="companyName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entreprise/Asso</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="address"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="city"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ville</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="countryCode"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pays (code ISO-2)</FormLabel>
              <FormControl>
                <Input placeholder="FR" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="countryName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du pays</FormLabel>
              <FormControl>
                <Input
                  placeholder="France"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ⬇️ ICI : value={field.value ?? ''} + handler qui accepte vide */}
        <FormField
          name="lat"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={field.value ?? ""} // permet de vider
                  onChange={toNumberChange(field.onChange)}
                  placeholder="ex: 48.8566"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="lng"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitude</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={field.value ?? ""} // permet de vider
                  onChange={toNumberChange(field.onChange)}
                  placeholder="ex: 2.3522"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="website"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site web</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="contactEmail"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email public</FormLabel>
              <FormControl>
                <Input
                  placeholder="contact@..."
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Description (publique)</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <p className="mt-1 text-xs text-muted-foreground">
                ⚠️ Stocker uniquement des informations <b>publiques</b> sur
                l’organisation. Aucune donnée privée.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="md:col-span-2 flex justify-end">
          <Button className="bg-amber-600 hover:bg-amber-700">
            + Créer un point
          </Button>
        </div>
      </form>
    </Form>
  );
}
