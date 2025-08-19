'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function ChangePasswordButton() {
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  async function submit() {
    setError(null);
    if (newPassword.length < 8) return setError("Le mot de passe doit faire au moins 8 caractères.");
    if (newPassword !== confirm) return setError("La confirmation ne correspond pas.");

    setBusy(true);
    try {
      const res = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setOpen(false);
        setCurrentPassword(''); setNewPassword(''); setConfirm('');
      } else {
        const j = await res.json().catch(() => ({}));
        setError(j?.error ?? 'Erreur lors du changement de mot de passe.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Changer le mot de passe</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Changer le mot de passe</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="c">Mot de passe actuel (laisse vide si tu n'en as pas)</Label>
            <Input id="c" type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="n">Nouveau mot de passe</Label>
            <Input id="n" type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="cf">Confirmer</Label>
            <Input id="cf" type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} />
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button onClick={submit} disabled={busy}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
