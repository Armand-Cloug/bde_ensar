// src/components/form/SignInForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'; 
import { useToast } from '@/hooks/use-toast'; 
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

import * as z from 'zod';
import Link from 'next/link';
import GoogleSignInButton from '../GoogleSignInButton';


const FormSchema = z.object({
  email: z.string().min(1, 'Veuillez saisir un email').email('Email invalide'),
  password: z
    .string()
    .min(1, 'Veuillez saisir un mot de passe')
    .min(8, 'Le mot de passe doit avoir au moins 8 caractères'),
});

const SignInForm = () => {
  const router = useRouter();
  const {toast} = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signInData = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    
    if (signInData?.error) {
      toast({
        title: "Erreur de connexion ",
        description: "Oups ! Quelquechose ne vas pas bien. Veuillez vérifier vos identifiants.",
        variant: 'destructive',
      })
    } else { 
      router.push('/account')
    }
  };

  return (
    <main>  
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
          <div className='space-y-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='mail@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de Passe</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Entrer votre mot de passe'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className='w-full mt-6' type='submit'>
            Se connecter
          </Button>
        </form>
        <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
          ou
        </div>
        <GoogleSignInButton>Se connecter avec Google</GoogleSignInButton>
        <p className='text-center text-sm text-gray-600 mt-2'>
          Si vous n'avez pas de compte, vous pouvez en créer un ici : {' '}
          <Link className='text-blue-500 hover:underline' href='/sign-up'>
            Inscription
          </Link>
        </p>
        <p className="text-center text-sm text-gray-600 mt-2">
          Si vous avez oublié votre mot de passe, vous pouvez le réinitialiser ici :{" "}
          <Link className="text-blue-500 hover:underline" href="/reset-password">
            Réinitialisation
          </Link>
        </p>
      </Form>
    </main>
  );
};

export default SignInForm;