// src/components/adhesion/AdhesionPayButton.tsx
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";

const HELLOASSO_URL =
  process.env.NEXT_PUBLIC_HELLOASSO_ADHESION_URL ||
  "https://www.helloasso.com/associations/bde-ensar/adhesions/bde-ensar-1";

export default function AdhesionPayButton() {
  return (
    <Button asChild className="h-12 px-6 text-base">
      <Link href={HELLOASSO_URL} prefetch={false}>
        Payer l’adhésion (HelloAsso)
      </Link>
    </Button>
  );
}
