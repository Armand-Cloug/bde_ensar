'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import GoogleSignInButton from '../GoogleSignInButton';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast'; 

const FormSchema = z
  .object({
    firstName: z.string().min(1, 'Veuillez saisir votre prénom').max(100),
    name: z.string().min(1, 'Veuillez saisir votre nom').max(100),
    email: z.string().min(1, 'Veuillez saisir votre email').email('Email Invalide'),
    password: z
      .string()
      .min(1, 'Veuillez saisir un mot de passe')
      .min(8, 'Le mot de passe doit faire au moins 8 caractères'),
    confirmPassword: z.string().min(1, 'Vous devez confirmer votre mot de passe'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Les mots de passe ne sont pas identiques',
  });

const SignUpForm = () => {
  const router = useRouter();
  const {toast} = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const response = await fetch('/api/user', {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: values.firstName,
        name: values.name,
        email: values.email,
        password: values.password,  
    })
  })

  if(response.ok){
    router.push('/sign-in');
  } else {
      toast({
        title: "Erreur de connexion ",
        description: "Oups ! Quelquechose ne vas pas bien. Veuillez vérifier vos identifiants.",
        variant: 'destructive',
      })
  }

};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
        <div className='space-y-2'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder='Armand' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de Famille</FormLabel>
                <FormControl>
                  <Input placeholder='Zireg' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer votre mot de passe</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Confirmer votre mot de passe'
                    type='password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className='w-full mt-6' type='submit'>
          S'inscire
        </Button>
      </form>
      <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
        ou
      </div>
      <GoogleSignInButton>S'inscrire avec Google</GoogleSignInButton>
      <p className='text-center text-sm text-gray-600 mt-2'>
        Sii vous avez déja un compte, vous pouvez vous connecter ici : {' '}
        <Link className='text-blue-500 hover:underline' href='/sign-in'>
          Se connecter
        </Link>
      </p>
    </Form>
  );
};

export default SignUpForm;