// app/donnees-personnelles/page.tsx
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Sparkles, FileText, Lock, Cookie } from "lucide-react";

const ORG = {
  name: "BDE ENSAR",
  controllerEmail: "bde.ensar.contact@gmail.com", // contact RGPD
  dpoName: "[À compléter]",                       // si DPO formel, sinon indique "Référent RGPD"
  dpoEmail: "[À compléter]",
  postalAddress: "[À compléter]",                 // adresse postale
};

export default function PrivacyPage() {
  const lastUpdate = new Date().toLocaleDateString("fr-FR");

  return (
    <main className="relative px-4 md:px-6 max-w-6xl mx-auto py-10 md:py-14 space-y-10">
      {/* Blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-20 h-[320px] w-[320px] rounded-full bg-orange-200/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-10 h-[280px] w-[280px] rounded-full bg-amber-200/40 blur-3xl" />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 text-white shadow">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-52 w-52 rounded-full bg-black/10 blur-2xl" />
        <div className="relative grid gap-6 p-8 md:p-12 md:grid-cols-[1.2fr,0.8fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur">
              <Sparkles className="h-4 w-4" /> Données personnelles
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
              Politique de confidentialité
            </h1>
            <p className="mt-3 text-white/90 max-w-2xl">
              Cette page explique comment nous traitons vos données, conformément au RGPD et aux recommandations de la CNIL.
            </p>
          </div>
          <div className="grid place-items-center">
            <div className="rounded-2xl bg-white/15 px-8 py-6 backdrop-blur shadow">
              <ShieldCheck className="h-12 w-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Responsable du traitement */}
      <section>
        <Card className="border-muted/60">
          <CardContent className="p-6 md:p-8 space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" /> Responsable du traitement
            </h2>
            <p className="text-muted-foreground">
              Le responsable du traitement est <strong>{ORG.name}</strong>.
              Vous pouvez nous joindre à <a href={`mailto:${ORG.controllerEmail}`} className="text-orange-600 hover:underline">{ORG.controllerEmail}</a> ou par courrier à {ORG.postalAddress}.
            </p>
            <p className="text-muted-foreground">
              Référent RGPD / DPO : <strong>{ORG.dpoName}</strong> — <a className="text-orange-600 hover:underline" href={`mailto:${ORG.dpoEmail}`}>{ORG.dpoEmail}</a> (si applicable).
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Finalités & bases légales */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-muted/60">
          <CardContent className="p-6 md:p-8 space-y-2">
            <h3 className="text-lg md:text-xl font-semibold">Finalités de traitement</h3>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Gestion des comptes et authentification (email/mot de passe, Google).</li>
              <li>Gestion des adhésions (paiement Stripe), de la vie associative et des événements.</li>
              <li>Communication directe (emails transactionnels) et, si consentement, newsletters.</li>
              <li>Amélioration du site et statistiques d’audience (si cookies/traceurs).</li>
              <li>Sécurité, prévention de la fraude, journalisation technique.</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-muted/60">
          <CardContent className="p-6 md:p-8 space-y-2">
            <h3 className="text-lg md:text-xl font-semibold">Bases légales</h3>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Exécution d’un contrat (création de compte, adhésion, participation à un événement).</li>
              <li>Obligations légales (facturation/comptabilité).</li>
              <li>Intérêt légitime (sécurité, lutte contre la fraude, amélioration du service).</li>
              <li>Consentement (newsletters, cookies non essentiels, mesure d’audience non exonérée).</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Données traitées & destinataires */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-muted/60">
          <CardContent className="p-6 md:p-8 space-y-2">
            <h3 className="text-lg md:text-xl font-semibold">Catégories de données</h3>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Identité (prénom, nom), coordonnées (email), photo de profil (si fournie).</li>
              <li>Données de vie associative (promotion, adhésion, rôle, alumni).</li>
              <li>Données de paiement (via Stripe — jetons/identifiants techniques, pas d’IBAN stocké chez nous).</li>
              <li>Données de connexion et de sécurité (logs techniques, horodatages).</li>
              <li>Préférences (consentement cookies, abonnements).</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-muted/60">
          <CardContent className="p-6 md:p-8 space-y-2">
            <h3 className="text-lg md:text-xl font-semibold">Destinataires</h3>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Équipe du BDE, habilitée et soumise à obligation de confidentialité.</li>
              <li>Sous-traitants techniques : hébergeur, prestataires email, outils analytiques.</li>
              <li>Prestataire de paiement : Stripe (traitement des paiements).</li>
              <li>Prestataires d’authentification sociale : Google (si utilisé).</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Transferts & durées */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-muted/60">
          <CardContent className="p-6 md:p-8 space-y-2">
            <h3 className="text-lg md:text-xl font-semibold">Transferts hors UE</h3>
            <p className="text-muted-foreground">
              Certains sous-traitants (ex. Google, Stripe) peuvent impliquer des transferts hors UE.
              Dans ce cas, nous nous appuyons sur des garanties appropriées (Clauses Contractuelles Types de la Commission européenne, mesures complémentaires le cas échéant).
            </p>
          </CardContent>
        </Card>
        <Card className="border-muted/60">
          <CardContent className="p-6 md:p-8 space-y-2">
            <h3 className="text-lg md:text-xl font-semibold">Durées de conservation</h3>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Compte utilisateur : durée d’utilisation du compte + 3 ans d’archivage inactif.</li>
              <li>Données d’adhésion et pièces comptables : selon obligations légales (jusqu’à 10 ans).</li>
              <li>Logs techniques et sécurité : quelques mois au plus, sauf obligation légale.</li>
              <li>Cookies/traceurs : selon leur finalité (voir Politique cookies).</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Droits RGPD & sécurité */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-muted/60">
          <CardContent className="p-6 md:p-8 space-y-2">
            <h3 className="text-lg md:text-xl font-semibold">Vos droits</h3>
            <p className="text-muted-foreground">
              Vous disposez des droits d’accès, de rectification, d’effacement, d’opposition, de limitation,
              et de portabilité lorsque c’est applicable. Pour les exercer, écrivez-nous à&nbsp;
              <a className="text-orange-600 hover:underline" href={`mailto:${ORG.controllerEmail}`}>{ORG.controllerEmail}</a>
              {ORG.dpoEmail !== "[À compléter]" ? <> ou <a className="text-orange-600 hover:underline" href={`mailto:${ORG.dpoEmail}`}>{ORG.dpoEmail}</a></> : null}.
              Vous pouvez également introduire une réclamation auprès de la CNIL.
            </p>
          </CardContent>
        </Card>
        <Card className="border-muted/60">
          <CardContent className="p-6 md:p-8 space-y-2">
            <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2"><Lock className="h-5 w-5 text-orange-600" /> Sécurité (bonnes pratiques ANSSI)</h3>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Chiffrement TLS en transit ; mots de passe hachés côté serveur.</li>
              <li>Principe du moindre privilège et journalisation des accès sensibles.</li>
              <li>Mises à jour régulières et correctifs de sécurité.</li>
              <li>Surveillance et sauvegardes régulières des données critiques.</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
