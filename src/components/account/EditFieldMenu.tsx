// components/account/EditFieldMenu.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MoreHorizontal } from 'lucide-react';

type EditableField = 'firstName' | 'lastName' | 'promotion' | 'birthdate' | 'company';

export default function EditFieldMenu({
  field,
  currentValue,
}: {
  field: EditableField;
  currentValue: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(currentValue);
  const [busy, setBusy] = React.useState(false);

  const isDate = field === 'birthdate';

  async function save() {
    setBusy(true);
    try {
      const res = await fetch('/api/account/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [field]: isDate && value ? new Date(value).toISOString() : (value || null),
        }),
      });
      if (res.ok) {
        setOpen(false);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => setOpen(true)}>Modifier</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier {labelFor(field)}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="val">{labelFor(field)}</Label>
            {isDate ? (
              <Input
                id="val"
                type="date"
                value={toInputDate(value)}
                onChange={(e) => setValue(e.target.value)}
              />
            ) : (
              <Input
                id="val"
                value={value === '—' ? '' : value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={labelFor(field)}
              />
            )}
          </div>
          <DialogFooter>
            <Button onClick={save} disabled={busy}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function labelFor(f: EditableField) {
  switch (f) {
    case 'firstName': return 'Prénom';
    case 'lastName': return 'Nom';
    case 'promotion': return 'Promotion';
    case 'birthdate': return 'Date de naissance';
    case 'company':  return 'Entreprise';
  }
}

function toInputDate(v: string) {
  if (!v || v === '—') return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  const parts = v.split('/');
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts.map((s) => s.trim());
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }
  return '';
}
