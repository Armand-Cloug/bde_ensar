'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateBdeButton() {
  const [open, setOpen] = useState(false);
  const [annee, setAnnee] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const router = useRouter();

  async function onCreate() {
    const res = await fetch("/api/admin/bde/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ annee, description, image }),
    });
    if (res.ok) {
      setOpen(false);
      setAnnee(""); setDescription(""); setImage("");
      router.refresh();
    }
  }

  const disabled = !annee.trim() || !description.trim();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Créer un BDE</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle équipe BDE</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid gap-1.5">
            <Label htmlFor="annee">Année</Label>
            <Input id="annee" placeholder="2024-2025" value={annee} onChange={e=>setAnnee(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} placeholder="Description de l'équipe…" value={description} onChange={e=>setDescription(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="image">URL image (optionnel)</Label>
            <Input id="image" placeholder="https://…" value={image} onChange={e=>setImage(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onCreate} disabled={disabled}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
