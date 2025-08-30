// src/app/(public)/contact/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram, Linkedin, Mail, MapPin, Sparkles } from "lucide-react";

import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";

const BDE_EMAIL = process.env.BDE_EMAIL || "bde.ensar.contact@gmail.com";
const BDE_ADDRESS = process.env.BDE_ADDRESS || "Adresse du BDE à compléter";

export default function ContactPage() {
  return (
    <main className="relative px-4 md:px-6 max-w-6xl mx-auto py-10 md:py-14">
      {/* décor doux (orange) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-20 h-[340px] w-[340px] rounded-full bg-orange-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-10 h-[300px] w-[300px] rounded-full bg-amber-200/40 blur-3xl"
      />

      <section className="relative grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
        {/* Colonne gauche : titre + réseaux + coordonnées */}
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 border-orange-100">
            <Sparkles className="h-3.5 w-3.5" />
            Entrer en contact
          </span>

          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Contacte le <span className="text-orange-600">BDE ENSAR</span>
          </h1>

          <p className="mt-3 text-base md:text-lg text-muted-foreground">
            Une question, une idée d’événement, un partenariat&nbsp;? On te
            répond vite. Tu peux aussi nous écrire directement par e-mail ou via
            les réseaux.
          </p>

          {/* Réseaux sociaux */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Réseaux</h2>
            <div className="flex items-center gap-3">
              <Link
                href="https://www.instagram.com/bde_ensar"
                target="_blank"
                aria-label="Instagram BDE"
                title="Instagram BDE"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white hover:bg-orange-50 transition"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/bde-ensar"
                target="_blank"
                aria-label="LinkedIn BDE"
                title="LinkedIn BDE"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white hover:bg-orange-50 transition"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Coordonnées */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Coordonnées</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  className="hover:underline"
                  href={`mailto:${BDE_EMAIL}`}
                  title="Envoyer un e-mail"
                >
                  {BDE_EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{BDE_ADDRESS}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Colonne droite : formulaire dans une carte */}
        <Card className="relative overflow-hidden border bg-white shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-xl">Nous écrire</CardTitle>
            <p className="text-sm text-muted-foreground">
              Laisse-nous ton message, on revient vers toi rapidement.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <ContactForm />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
