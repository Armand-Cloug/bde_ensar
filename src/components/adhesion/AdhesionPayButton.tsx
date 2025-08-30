// src/components/adhesion/AdhesionPayButton.tsx
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdhesionPayButton() {
  const [loading, setLoading] = useState(false);

  async function onPay() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout/adhesion", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create checkout");
      const json = await res.json();
      if (json.url) window.location.href = json.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={onPay} disabled={loading} className="h-12 px-6 text-base">
      {loading ? "Redirection…" : "Payer l’adhésion"}
    </Button>
  );
}
