// src/components/stages/AddSpotDialog.tsx
'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import SpotForm from "@/components/admin/tabs/stages/SpotForm";
import * as React from "react";

export default function AddSpotDialog() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="bg-amber-600 hover:bg-amber-700">
          <Plus className="mr-2 h-4 w-4" />
          Proposer un stage
        </Button>
      </DialogTrigger>

      {/* 👇 z-index élevé pour passer au-dessus de Leaflet */}
      <DialogContent className="sm:max-w-2xl z-[2000]">
        <DialogHeader>
          <DialogTitle>Ajouter un point (Stage)</DialogTitle>
          <DialogDescription>
            Seules des informations <strong>publiques</strong> sur
            l’organisation doivent être renseignées. Une validation par un
            administrateur est nécessaire avant affichage.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          <SpotForm
            onCreated={() => {
              setOpen(false);
              router.refresh();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
