// src/components/auth/RequestResetForm.tsx
'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RequestForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error ?? "Une erreur est survenue.");
      } else {
        setSent(true);
      }
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <p className="text-sm">
        Si un compte existe pour <strong>{email}</strong>, un email de réinitialisation a été envoyé.
        Pensez à vérifier vos spams.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-1">
        <label className="text-sm">Email</label>
        <Input
          type="email"
          placeholder="vous@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Envoi..." : "Envoyer le lien"}
      </Button>
    </form>
  );
}
