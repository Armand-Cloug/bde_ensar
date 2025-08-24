// components/stages/SpotForm.tsx
// Used in AdminPanel
"use client";

import * as React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
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
  lat: z.preprocess((v) => Number(v), z.number().finite()),
  lng: z.preprocess((v) => Number(v), z.number().finite()),
  contactEmail: z.string().email().optional(),
  website: z.string().url().optional(),
  description: z.string().max(2000).optional(),
});

export default function SpotForm({ onCreated }: { onCreated?: () => void }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: {
      title: "", companyName: "", address: "", city: "",
      countryCode: "FR", countryName: "France",
      lat: 48.8566, lng: 2.3522
    },
  });

  const onSubmit = async (values: z.infer<typeof Schema>) => {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">
        <FormField name="title" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Titre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
        )} />
        <FormField name="companyName" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Entreprise/Asso</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
        )} />
        <FormField name="address" control={form.control} render={({ field }) => (
          <FormItem className="md:col-span-2"><FormLabel>Adresse</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
        )} />
        <FormField name="city" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Ville</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
        )} />
        <FormField name="countryCode" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Pays (code ISO-2)</FormLabel><FormControl><Input placeholder="FR" {...field} /></FormControl><FormMessage/></FormItem>
        )} />
        <FormField name="countryName" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Nom du pays</FormLabel><FormControl><Input placeholder="France" {...field} /></FormControl><FormMessage/></FormItem>
        )} />
        <FormField name="lat" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Latitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage/></FormItem>
        )} />
        <FormField name="lng" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Longitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage/></FormItem>
        )} />
        <FormField name="website" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Site web</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage/></FormItem>
        )} />
        <FormField name="contactEmail" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Email public</FormLabel><FormControl><Input placeholder="contact@..." {...field} /></FormControl><FormMessage/></FormItem>
        )} />
        <FormField name="description" control={form.control} render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Description (publique)</FormLabel>
            <FormControl><Textarea rows={3} {...field} /></FormControl>
            <p className="text-xs text-muted-foreground mt-1">
              ⚠️ Stocker uniquement des informations **publiques** sur l’organisation. Aucune donnée privée.
            </p>
            <FormMessage/>
          </FormItem>
        )} />
        <div className="md:col-span-2 flex justify-end">
          <Button className="bg-orange-600 hover:bg-orange-700">Créer</Button>
        </div>
      </form>
    </Form>
  );
}
