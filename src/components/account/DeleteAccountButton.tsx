'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'next-auth/react';

export default function DeleteAccountButton() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    if (!confirm("Cette action est irréversible. Supprimer définitivement votre compte ?")) return;
    setLoading(true);
    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE' });
      if (!res.ok) throw new Error('delete-failed');
      toast({ title: 'Compte supprimé', description: 'Votre compte a été supprimé.' });
      await signOut({ callbackUrl: '/' });
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le compte pour le moment.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={onDelete}
      disabled={loading}
      className="ml-auto"
      title="Supprimer définitivement le compte"
    >
      {loading ? 'Suppression…' : 'Supprimer mon compte'}
    </Button>
  );
}
