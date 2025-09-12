'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import SpotForm from "@/components/admin/tabs/stages/SpotForm";

export default function AddSpotDialog() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="bg-amber-600 hover:bg-amber-700">
          <Plus className="mr-2 h-4 w-4" />
          Partager mon stage
        </Button>
      </DialogTrigger>

      {/* z-index élevé pour passer au-dessus de Leaflet */}
      <DialogContent
        className="
          z-[2000]
          w-[95vw] sm:max-w-2xl
          max-h-[85vh]
          p-0
          overflow-hidden
        "
      >
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Ajouter un point (Stage)</DialogTitle>
          <DialogDescription>
            Seules des informations <strong>publiques</strong> sur
            l’organisation doivent être renseignées. Une validation par un
            administrateur est nécessaire avant affichage.
          </DialogDescription>
        </DialogHeader>

        {/* Corps scrollable sur petits écrans */}
        <div
          className="
            px-6 pb-6
            overflow-y-auto
            max-h-[calc(85vh-110px)]
            overscroll-contain
          "
        >
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
