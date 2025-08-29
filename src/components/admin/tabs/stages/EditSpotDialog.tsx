'use client';

import * as React from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Resolver } from "react-hook-form";

const Schema = z.object({
  title: z.string().min(2),
  companyName: z.string().min(2),
  address: z.string().min(3),
  city: z.string().optional().nullable(),
  countryCode: z.string().min(2).max(2),
  countryName: z.string().optional().nullable(),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  website: z.string().url().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
});

type Props = {
  spotId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved?: () => void;
};

export default function EditSpotDialog({ spotId, open, onOpenChange, onSaved }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      title: "",
      companyName: "",
      address: "",
      city: "",
      countryCode: "FR",
      countryName: "France",
      lat: 0,
      lng: 0,
      website: "",
      contactEmail: "",
      description: "",
    },
  });

  // Charge la fiche complète à l’ouverture
  React.useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const res = await fetch(`/api/internships/spots/${spotId}`, { cache: 'no-store' });
        const json = await res.json();
        const s = json?.spot ?? json; // compatible avec différentes réponses
        form.reset({
          title: s.title ?? '',
          companyName: s.companyName ?? '',
          address: s.address ?? '',
          city: s.city ?? '',
          countryCode: s.countryCode ?? 'FR',
          countryName: s.countryName ?? '',
          lat: Number(s.lat ?? 0),
          lng: Number(s.lng ?? 0),
          website: s.website ?? '',
          contactEmail: s.contactEmail ?? '',
          description: s.description ?? '',
        });
      } catch {
        toast({ title: 'Erreur', description: 'Impossible de charger le point', variant: 'destructive' });
        onOpenChange(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, spotId]);

  const onSubmit = async (values: z.infer<typeof Schema>) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/internships/spots/${spotId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('patch');
      toast({ title: 'Enregistré', description: 'Le point a été mis à jour.' });
      onOpenChange(false);
      onSaved?.();
    } catch {
      toast({ title: 'Erreur', description: 'Mise à jour impossible', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le point</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">
            <FormField name="title" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Titre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="companyName" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Entreprise / Asso</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="address" control={form.control} render={({ field }) => (
              <FormItem className="md:col-span-2"><FormLabel>Adresse</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="city" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Ville</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="countryCode" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Pays (code ISO-2)</FormLabel><FormControl><Input placeholder="FR" {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="countryName" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Nom du pays</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="lat" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Latitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="lng" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Longitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="website" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Site web</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="contactEmail" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Email public</FormLabel><FormControl><Input placeholder="contact@..." {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="description" control={form.control} render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Description (publique)</FormLabel>
                <FormControl><Textarea rows={3} {...field} /></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700" disabled={loading} type="submit">
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
