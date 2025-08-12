'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { MoreHorizontal, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr'; 

type EditableField =
  | 'firstName'
  | 'lastName'
  | 'role'
  | 'isAdherent'
  | 'isAlumni'
  | 'promotion'
  | 'birthdate'
  | 'company';

export default function EditFieldMenu({
  userId,
  field,
  value,
}: {
  userId: string;
  field: EditableField;
  value: any;
}) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState<any>(value ?? null);
  const isBool = field === 'isAdherent' || field === 'isAlumni';
  const isRole = field === 'role';
  const isDate = field === 'birthdate';

  async function onSave() {
    const payload: any = {};
    if (isDate) {
      payload[field] = val ? new Date(val as Date).toISOString() : null;
    } else {
      payload[field] = val;
    }
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setOpen(false);
      // (optionnel) router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Modifier">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Modifier</DialogTitle></DialogHeader>

        {/* champs selon le type */}
        {isBool ? (
          <div className="flex items-center justify-between">
            <span>Valeur</span>
            <Switch checked={!!val} onCheckedChange={setVal} />
          </div>
        ) : isRole ? (
          <Select value={val ?? 'utilisateur'} onValueChange={setVal}>
            <SelectTrigger><SelectValue placeholder="Rôle" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="utilisateur">utilisateur</SelectItem>
              <SelectItem value="admin">admin</SelectItem>
            </SelectContent>
          </Select>
        ) : isDate ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !val && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {val ? format(val as Date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar
                mode="single"
                selected={val ? new Date(val as Date) : undefined}
                onSelect={(d) => setVal(d ?? null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        ) : (
          <Input value={val ?? ''} onChange={(e)=>setVal(e.target.value)} />
        )}

        <DialogFooter>
          <Button onClick={onSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
