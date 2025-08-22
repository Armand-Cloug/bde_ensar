'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Props = {
  searchValue: string;
  onSearchChange: (v: string) => void;
  onOpenCreate: () => void;
};

export default function HeaderBar({ searchValue, onSearchChange, onOpenCreate }: Props) {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Rechercher un évènement…"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-64"
      />
      <Button onClick={onOpenCreate} className="bg-amber-500 hover:bg-amber-600 text-white">
        Nouvel événement
      </Button>
    </div>
  );
}
