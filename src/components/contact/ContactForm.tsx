// components/contact/ContactForm.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes("@")) {
      setError("Veuillez saisir un email valide.");
      return;
    }
    if (!subject.trim() || !message.trim()) {
      setError("Merci de renseigner un objet et un message.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, message }),
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
        Merci ! Votre message a bien été envoyé. Un accusé de réception a été
        transmis à <strong>{email}</strong>. Vérifiez vos spams si besoin.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-1">
        <label className="text-sm">Votre email</label>
        <Input
          type="email"
          placeholder="vous@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-1">
        <label className="text-sm">Objet</label>
        <Input
          placeholder="Objet du message"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-1">
        <label className="text-sm">Message</label>
        <Textarea
          placeholder="Votre message…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px]"
          required
        />
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Envoi en cours…" : "Envoyer"}
      </Button>
    </form>
  );
}
