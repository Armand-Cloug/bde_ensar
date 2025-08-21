// app/mentions-legales/page.tsx
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Sparkles, Library, Scale, AtSign, Globe } from "lucide-react";

const ORG = {
  name: "BDE ENSAR",                 // [À compléter si autre]
  legalForm: "[À compléter]",        // ex. "Association loi 1901" ou "SAS"
  capital: "[À compléter]",          // ex. "Capital social : 1 000 €" (si société) / sinon retirer
  siren: "[À compléter]",            // ex. "SIREN : 123 456 789"
  rcs: "[À compléter]",              // ex. "RCS Rennes 123 456 789"
  address: "[À compléter]",          // ex. "xx rue, 35000 Rennes, France"
  email: "bde.ensar.contact@gmail.com",
  phone: "[À compléter]",            // ex. "+33 x xx xx xx xx"
  director: "[À compléter]",         // Directeur·rice de la publication
  hostName: "[À compléter]",         // Hébergeur (ex. Vercel / OVH / Scaleway…)
  hostAddress: "[À compléter]",      // Adresse de l’hébergeur
  hostContact: "[À compléter]"       // URL/phone/email de l’hébergeur
};

export default function MentionsLegalesPage() {
  const lastUpdate = new Date().toLocaleDateString("fr-FR");

  return (
    <main className="relative px-4 md:px-6 max-w-6xl mx-auto py-10 md:py-14 space-y-10">
      {/* Blobs décoratifs */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-20 h-[320px] w-[320px] rounded-full bg-orange-200/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-10 h-[280px] w-[280px] rounded-full bg-amber-200/40 blur-3xl" />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 text-white shadow">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-52 w-52 rounded-full bg-black/10 blur-2xl" />
        <div className="relative grid gap-6 p-8 md:p-12 md:grid-cols-[1.2fr,0.8fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur">
              <Sparkles className="h-4 w-4" /> Informations légales
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">Mentions légales</h1>
            <p className="mt-3 text-white/90 max-w-2xl">
              Conformément aux obligations légales, vous trouverez ci-dessous les informations relatives à l’éditeur du site, à son hébergeur, ainsi que les conditions d’utilisation.
            </p>
          </div>
          <div className="grid place-items-center">
            <div className="rounded-2xl bg-white/15 px-8 py-6 backdrop-blur shadow">
              <Shield className="h-12 w-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Identité de l’éditeur */}
      <section>
        <Card className="border-muted/60">
          <CardContent className="p-6 md:p-8 space-y-3">
            <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
              <Library className="h-5 w-5 text-orange-600" /> Éditeur du site
            </h2>
            <ul className="grid gap-2">
              <li><strong>Nom :</strong> {ORG.name}</li>
              <li><strong>Statut juridique :</strong> {ORG.legalForm}</li>
              {ORG.capital !== "[À compléter]" && <li><strong>Capital :</strong> {ORG.capital}</li>}
              <li><strong>SIREN / RCS :</strong> {ORG.siren} {ORG.rcs !== "[À compléter]" ? `— ${ORG.rcs}` : ""}</li>
              <li><strong>Email :</strong> {ORG.address}</li>
              <li><strong>Adresse :</strong> <a href={`mailto:${ORG.email}`} className="hover:underline">{ORG.email}</a></li>
              <li><strong>Téléphone :</strong> {ORG.phone}</li>
              <li><strong>Directeur·rice de la publication :</strong> {ORG.director}</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Hébergeur */}
      <section>
        <Card className="border-muted/60">
          <CardContent className="p-6 md:p-8 space-y-3">
            <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5 text-orange-600" /> Hébergement
            </h2>
            <ul className="grid gap-2">
              <li><strong>Hébergeur :</strong> {ORG.hostName}</li>
              <li><strong>Adresse :</strong> {ORG.hostAddress}</li>
              <li><strong>Contact :</strong> {ORG.hostContact}</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Propriété intellectuelle & responsabilités */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-muted/60">
          <CardContent className="p-6 md:p-8 space-y-2">
            <h3 className="text-lg md:text-xl font-semibold">Propriété intellectuelle</h3>
            <p className="text-muted-foreground">
              L’ensemble des contenus (textes, images, logos, vidéos, etc.) présents sur ce site sont protégés par le droit d’auteur et, le cas échéant, par des droits de propriété industrielle.
              Toute reproduction, représentation, modification ou diffusion sans autorisation préalable est interdite.
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted/60">
          <CardContent className="p-6 md:p-8 space-y-2">
            <h3 className="text-lg md:text-xl font-semibold">Responsabilité</h3>
            <p className="text-muted-foreground">
              Les informations publiées sont fournies à titre indicatif. Malgré nos efforts de mise à jour, le BDE ne peut garantir l’exactitude ou l’exhaustivité des contenus.
              Le site peut contenir des liens vers des sites tiers ; nous n’exerçons aucun contrôle sur leur contenu et déclinons toute responsabilité à ce titre.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Droit applicable & contact */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-muted/60">
          <CardContent className="p-6 md:p-8 space-y-2">
            <h3 className="text-lg md:text-xl font-semibold">Droit applicable</h3>
            <p className="text-muted-foreground">
              Le présent site est soumis au droit français. En cas de litige, et à défaut de résolution amiable, les juridictions françaises sont compétentes.
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted/60">
          <CardContent className="p-6 md:p-8 space-y-2">
            <h3 className="text-lg md:text-xl font-semibold">Contact</h3>
            <p className="text-muted-foreground">
              Pour toute question concernant ces mentions, écrivez-nous à&nbsp;
              <a className="text-orange-600 hover:underline" href={`mailto:${ORG.email}`}>{ORG.email}</a>.
            </p>
            <p className="text-xs text-muted-foreground/80">Dernière mise à jour : {lastUpdate}</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
