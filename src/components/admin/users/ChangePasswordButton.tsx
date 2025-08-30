// src/components/admin/users/ChangePasswordButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

export default function ChangePasswordButton({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');

  async function onSave() {
    if (pwd !== confirm) return;
    const res = await fetch(`/api/admin/users/${userId}/password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd }),
    });
    if (res.ok) setOpen(false);
    // (optionnel) toast
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Changer le mot de passe</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau mot de passe</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)} placeholder="Mot de passe" />
          <Input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="Confirmer" />
        </div>
        <DialogFooter>
          <Button onClick={onSave} disabled={!pwd || pwd !== confirm}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
