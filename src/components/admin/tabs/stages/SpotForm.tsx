// src/components/admin/tabs/stages/SpotForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Resolver } from "react-hook-form";

import {
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
} from "@/components/ui/form";

import * as React from "react";
import * as z from "zod";

const Schema = z.object({
  title: z.string().min(2),
  companyName: z.string().min(2),
  address: z.string().min(3),
  city: z.string().optional(),          // string | undefined
  countryCode: z.string().min(2).max(2),
  countryName: z.string().optional(),   // string | undefined
  // ✅ coerce pour éviter unknown et avoir bien des number
  lat: z.coerce.number().finite(),
  lng: z.coerce.number().finite(),
  contactEmail: z.string().email().optional(),
  website: z.string().url().optional(),
  description: z.string().max(2000).optional(),
});

type FormValues = z.infer<typeof Schema>;

export default function SpotForm({ onCreated }: { onCreated?: () => void }) {
  const { toast } = useToast();

  // ⚠️ typer useForm et caster le resolver si versions pas parfaitement alignées
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
      toast({ title: "Échec", description: "Création impossible", variant: "destructive" });
      return;
    }
    toast({ title: "Créé", description: "Point ajouté. En attente de validation." });
    form.reset();
    onCreated?.();
  };

  // helper pour convertir les <input type="number">
  const toNumberChange =
    (onChange: (v: number | undefined) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      onChange(v === "" ? undefined : Number(v));
    };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">
        <FormField name="title" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Titre</FormLabel>
            <FormControl><Input {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage/>
          </FormItem>
        )} />

        <FormField name="companyName" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Entreprise/Asso</FormLabel>
            <FormControl><Input {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage/>
          </FormItem>
        )} />

        <FormField name="address" control={form.control} render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Adresse</FormLabel>
            <FormControl><Input {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage/>
          </FormItem>
        )} />

        <FormField name="city" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Ville</FormLabel>
            <FormControl><Input {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage/>
          </FormItem>
        )} />

        <FormField name="countryCode" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Pays (code ISO-2)</FormLabel>
            <FormControl><Input placeholder="FR" {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage/>
          </FormItem>
        )} />

        <FormField name="countryName" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Nom du pays</FormLabel>
            <FormControl><Input placeholder="France" {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage/>
          </FormItem>
        )} />

        <FormField name="lat" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Latitude</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="any"
                {...field}
                onChange={toNumberChange(field.onChange)}
              />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )} />

        <FormField name="lng" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Longitude</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="any"
                {...field}
                onChange={toNumberChange(field.onChange)}
              />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )} />

        <FormField name="website" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Site web</FormLabel>
            <FormControl><Input placeholder="https://..." {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage/>
          </FormItem>
        )} />

        <FormField name="contactEmail" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Email public</FormLabel>
            <FormControl><Input placeholder="contact@..." {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage/>
          </FormItem>
        )} />

        <FormField name="description" control={form.control} render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Description (publique)</FormLabel>
            <FormControl>
              <Textarea rows={3} {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)} />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">
              ⚠️ Stocker uniquement des informations <b>publiques</b> sur l’organisation. Aucune donnée privée.
            </p>
            <FormMessage/>
          </FormItem>
        )} />

        <div className="md:col-span-2 flex justify-end">
          <Button className="bg-amber-600 hover:bg-amber-700">+ Créer un point</Button>
        </div>
      </form>
    </Form>
  );
}
