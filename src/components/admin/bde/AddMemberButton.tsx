// components/admin/bde/AddMemberButton.tsx
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AddMemberButton({ teamId }: { teamId: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [poste, setPoste] = useState("");
  const [photo, setPhoto] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  async function onAdd() {
    const res = await fetch(`/api/admin/bde/teams/${teamId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        poste,
        photo: photo || undefined,
        description: description || undefined,
      }),
    });
    if (res.ok) {
      setOpen(false);
      setEmail(""); setPoste(""); setPhoto(""); setDescription("");
      router.refresh();
    }
  }

  const disabled = !email.trim() || !poste.trim();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter un membre</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un membre à l'équipe</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email de l'utilisateur</Label>
            <Input id="email" placeholder="user@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="poste">Poste</Label>
            <Input id="poste" placeholder="Président, Trésorier, ..." value={poste} onChange={(e)=>setPoste(e.target.value)} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="photo">URL photo (optionnel)</Label>
            <Input id="photo" placeholder="https://…" value={photo} onChange={(e)=>setPhoto(e.target.value)} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="desc">Description (optionnel)</Label>
            <Textarea id="desc" rows={4} placeholder="Description du membre pour cette équipe…" value={description} onChange={(e)=>setDescription(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onAdd} disabled={disabled}>Ajouter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
