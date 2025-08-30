// src/components/form/AddNameForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';  // adapte si besoin (../ui/input)
import { Button } from '@/components/ui/button'; // adapte si besoin (../ui/button)
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'; // adapte si besoin (../ui/form)

import * as z from 'zod';

const FormSchema = z.object({
  firstName: z.string().min(1, 'Veuillez saisir votre prénom'),
  lastName: z.string().min(1, 'Veuillez saisir votre nom'),
});

export default function AddNameForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const res = await fetch('/api/user/complete-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      toast({
        title: 'Erreur',
        description: "Impossible d'enregistrer vos informations. Réessayez.",
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Profil complété',
      description: 'Vos informations ont été enregistrées.',
    });
    router.push('/account'); // ou la route de ton choix
  };

  return (
    <main>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="w-full mt-6" type="submit">
            Enregistrer
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-2">
          Vous pourrez modifier ces informations plus tard dans{' '}
          <a className="text-blue-500 hover:underline" href="/account">
            Mon compte
          </a>
          .
        </p>
      </Form>
    </main>
  );
}
