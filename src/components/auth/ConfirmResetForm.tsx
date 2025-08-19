"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ConfirmForm({ token, email }: { token: string; email: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Le mot de passe doit faire au moins 8 caractères.");
    if (password !== confirm) return setError("La confirmation ne correspond pas.");

    setBusy(true);
    try {
      const res = await fetch("/api/auth/reset-password/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });
      if (res.ok) {
        router.push("/sign-in");
      } else {
        const j = await res.json().catch(() => ({}));
        setError(j?.error ?? "Lien invalide ou expiré.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-1">
        <label className="text-sm">Nouveau mot de passe</label>
        <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
      </div>
      <div className="grid gap-1">
        <label className="text-sm">Confirmer</label>
        <Input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required />
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
