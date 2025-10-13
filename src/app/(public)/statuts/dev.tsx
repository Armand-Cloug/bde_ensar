// src/app/(public)/status/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Statuts, Règlement & Données — BDE ENSAR",
  description:
    "Cadre légal de l’association BDE ENSAR : statuts (loi 1901), règlement intérieur, et charte de protection des données personnelles.",
  alternates: { canonical: "/status" },
};

function PdfLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Button asChild variant="outline" className="h-9">
      <Link href={href} target="_blank" rel="noopener noreferrer">
        Télécharger le PDF — {label}
      </Link>
    </Button>
  );
}

export default function StatusPage() {
  return (
    <main className="px-4 md:px-6 max-w-4xl mx-auto w-full py-10">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Cadre de l’association</h1>
        <p className="text-muted-foreground mt-2">
          Retrouvez ici les statuts (loi 1901), le règlement intérieur, et notre charte de
          protection des données personnelles.
        </p>
      </header>

      <Tabs defaultValue="statuts" className="w-full">
        <TabsList className="grid grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="statuts">Statuts</TabsTrigger>
          <TabsTrigger value="reglement">Règlement intérieur</TabsTrigger>
          <TabsTrigger value="rgpd">Protection des données</TabsTrigger>
        </TabsList>

        {/* ───────────────────────── Statuts ───────────────────────── */}
        <TabsContent value="statuts" className="mt-6">
          <Card>
            <CardHeader className="gap-2">
              <CardTitle>Statuts de l’Association BDE ENSAR</CardTitle>
              <div className="flex flex-wrap gap-2">
                <PdfLink href="/docs/Statuts_BDE_ENSAR_V2.pdf" label="Statuts" />
              </div>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-sm text-muted-foreground -mt-2">
                Association régie par la loi du 1er juillet 1901 et le décret du 16 août 1901.
              </p>

              <Accordion type="single" collapsible className="mt-4">
                <Article number={1} title="Constitution et dénomination">
                  Il est fondé entre les adhérents une association ayant pour titre
                  <strong> BDE ENSAR</strong>, régie par la loi de 1901.
                </Article>

                <Article number={2} title="Buts">
                  <ul>
                    <li>Organiser des activités pour la camaraderie et la vie étudiante de l’ENSAR.</li>
                    <li>Servir de lien entre étudiants, administration et enseignants.</li>
                    <li>Favoriser l’entraide et les échanges (tutorat, réseau).</li>
                    <li>Vendre des goodies/services/produits liés aux activités de l’association.</li>
                  </ul>
                </Article>

                <Article number={3} title="Siège social">
                  Siège au <strong>11 Rue Archimède, 79000 Niort</strong> (Campus de Niort,
                  Université de Poitiers). Transférable par décision du bureau avec information à l’AG.
                </Article>

                <Article number={4} title="Durée">
                  La durée de l’association est <strong>illimitée</strong>.
                </Article>

                <Article number={5} title="Admission et adhésion">
                  Conditions : être étudiant·e ou personnel de l’Université de Poitiers, adhérer aux
                  statuts, s’acquitter d’une <strong>cotisation annuelle de 5 €</strong>. L’association
                  garantit l’absence de discrimination et la liberté de conscience. Les mineurs
                  peuvent adhérer (après avis du bureau).
                </Article>

                <Article number={6} title="Composition">
                  <p>
                    <strong>Membres actifs</strong> : à jour de cotisation, participent aux activités,
                    votent en assemblée générale.
                  </p>
                </Article>

                <Article number={7} title="Bureau">
                  <p>Le bureau comprend : président·e, vice-président·e(s), trésorier·ère, secrétaire,
                    et adjoint·e(s) si besoin. Mandat d’un an, rééligible. Remplacement provisoire
                    possible en cas de vacance, puis validation à l’AG suivante.</p>
                </Article>

                <Article number={8} title="Perte de la qualité de membre">
                  Démission / non-renouvellement, décès, ou radiation motivée par le bureau (avec
                  possibilité d’explications).
                </Article>

                <Article number={9} title="Finances">
                  <ul>
                    <li>Cotisations, subventions éventuelles, ventes de produits/services, sponsoring,</li>
                    <li>et plus largement toutes ressources autorisées par la loi.</li>
                  </ul>
                  Les fonctions associatives sont bénévoles ; frais remboursables sur justificatifs et accord du bureau.
                </Article>

                <Article number={10} title="Assemblée générale ordinaire (AGO)">
                  AGO annuelle, convocation au moins 7 jours avant. <strong>Quorum 60 %</strong>.
                  Décisions à la majorité des suffrages exprimés. Rapport moral et financier présentés,
                  renouvellement des membres sortants du bureau.
                </Article>

                <Article number={11} title="Indemnités">
                  Fonctions bénévoles ; remboursements éventuels (mission, déplacement,
                  représentation) détaillés au rapport financier.
                </Article>

                <Article number={12} title="Règlement intérieur">
                  Établi par le bureau, approuvé par l’AG ; précise l’administration interne.
                </Article>

                <Article number={13} title="Assemblée générale extraordinaire (AGE)">
                  Réunie si besoin (modification statuts, dissolution…). Même modalités de convocation
                  que l’AGO ; décisions à la majorité des membres présents.
                </Article>

                <Article number={14} title="Dissolution">
                  Liquidateur(s) nommé(s). L’actif net est dévolu à un organisme à but non lucratif ou
                  une association aux buts similaires ; aucun membre ne peut en bénéficier.
                </Article>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ──────────────────────── Règlement intérieur ──────────────────────── */}
        <TabsContent value="reglement" className="mt-6">
          <Card>
            <CardHeader className="gap-2">
              <CardTitle>Règlement intérieur</CardTitle>
              <div className="flex flex-wrap gap-2">
                <PdfLink href="/docs/Reglement_Interieur_BDE_ENSAR_V2.pdf" label="Règlement intérieur" />
              </div>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-sm text-muted-foreground -mt-2">
                Complète les statuts et s’impose aux membres et bénévoles. En cas de contradiction,
                les statuts prévalent.
              </p>

              <Accordion type="multiple" className="mt-4">
                <Section title="Titre I — Membres">
                  <h4 className="font-semibold">Art. 1 — Adhésion</h4>
                  <p>
                    Adhésion enregistrée via le moyen retenu par le bureau, réservée aux étudiants
                    de l’ENSAR (Campus de Niort). Confirmation après paiement de la cotisation, acceptation
                    des statuts et du règlement.
                  </p>
                  <h4 className="font-semibold mt-3">Art. 2 — Cotisation</h4>
                  <p>Montant fixé par l’AG (référence : statuts et décisions annuelles).</p>
                  <h4 className="font-semibold mt-3">Art. 3 — Droits & devoirs</h4>
                  <ul>
                    <li>Participation aux activités et AG (voix délibérative si à jour de cotisation).</li>
                    <li>Respect des personnes, des locaux et du matériel ; absence de préjudice à l’asso.</li>
                  </ul>
                  <h4 className="font-semibold mt-3">Art. 4 — Discipline</h4>
                  <p>Avertissement, suspension temporaire ou radiation possible (après audition) en cas
                    d’infractions graves ou de manquements répétés.</p>
                  <h4 className="font-semibold mt-3">Art. 5 — Perte de la qualité de membre</h4>
                  <p>Démission simple par courrier/courriel, décès, ou sanctions disciplinaires.</p>
                </Section>

                <Section title="Titre II — Activités & locaux">
                  <h4 className="font-semibold">Art. 6 — Déroulement</h4>
                  <p>Activités sous la responsabilité du bureau et des bénévoles ; respect des consignes
                    de sécurité ; assurance personnelle recommandée.</p>
                  <h4 className="font-semibold mt-3">Art. 7 — Locaux</h4>
                  <ul>
                    <li>Respect des règles d’accès et d’usage ; tenue appropriée.</li>
                    <li>Interdiction de fumer ; réparation des dégradations ; tri des déchets.</li>
                  </ul>
                  <h4 className="font-semibold mt-3">Art. 8 — Clubs</h4>
                  <p>Responsables membres de l’asso ; dossier de création (liste dirigeants, nb. d’adhérents,
                    projet, budget prévisionnel…) 14 jours avant le CA.</p>
                </Section>

                <Section title="Titre III — Fonctionnement">
                  <h4 className="font-semibold">Art. 9 — Bureau</h4>
                  <p>Gestion courante ; rôles : Président, Vice-Président(s), Secrétaire général, Trésorier,
                    Communication, Événementiel (détail des attributions). Réunions sur convocation du Président.</p>
                  <h4 className="font-semibold mt-3">Art. 10 — Assemblée générale</h4>
                  <ul>
                    <li>Documents présentés : rapports moral, d’activité, financier.</li>
                    <li>AGO : approuve comptes / fixe cotisation / renouvelle instances / délibère l’ordre du jour.</li>
                    <li>AGE : statuts, dissolution, fusion, disposition des biens, sur convocation ou demande 50 % des membres.</li>
                  </ul>
                </Section>

                <Section title="Titre IV — Dispositions diverses">
                  <h4 className="font-semibold">Art. 11 — Déontologie</h4>
                  <p>Ouverture, bénévolat, tolérance, respect ; neutralité politique/religieuse ; proscription
                    des comportements contraires à l’éthique.</p>
                  <h4 className="font-semibold mt-3">Art. 12 — Confidentialité</h4>
                  <p>Fichier des membres confidentiel (CNIL). Droit d’accès/rectification (loi “Informatique
                    & Libertés”). Aucune transmission à des tiers.</p>
                  <h4 className="font-semibold mt-3">Art. 13 — Adoption & publicité</h4>
                  <p>Établi conformément aux statuts ; modification/ratification en AG ; diffusion aux membres
                    et affichage dans les locaux.</p>
                </Section>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ───────────────────── Protection des données (RGPD) ───────────────────── */}
        <TabsContent value="rgpd" className="mt-6">
          <Card>
            <CardHeader className="gap-2">
              <CardTitle>Protection des données (Charte)</CardTitle>
              <div className="flex flex-wrap gap-2">
                <PdfLink href="/docs/Charte_Protection_Donnees_BDE_ENSAR.pdf" label="Charte données" />
              </div>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Les informations collectées via le formulaire d’adhésion sont traitées par le BDE ENSAR,
                consultables uniquement par le bureau, afin de : formaliser l’adhésion, éditer la carte
                de membre et tenir la liste des adhérents.
              </p>
              <ul>
                <li><strong>Base légale</strong> : consentement.</li>
                <li><strong>Données traitées</strong> : nom, prénom, email universitaire, majorité, promotion.</li>
                <li><strong>Durée de conservation</strong> : 1 an (révisable selon obligations légales).</li>
                <li><strong>Destinataire</strong> : le bureau du BDE ENSAR.</li>
              </ul>

              <h4 className="mt-4">Vos droits</h4>
              <ul>
                <li>Accès, rectification, effacement (selon conditions), limitation, portabilité, opposition.</li>
                <li>Retrait du consentement à tout moment.</li>
              </ul>
              <p className="mt-2">
                Exercer vos droits / questions :{" "}
                <a className="underline" href="mailto:bde.ensar.contact@gmail.com">
                  bde.ensar.contact@gmail.com
                </a>. En cas de désaccord persistant, réclamation possible auprès de la CNIL.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

function Article({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem value={`a-${number}`}>
      <AccordionTrigger className="text-left">
        <span className="font-semibold">Article {number} — {title}</span>
      </AccordionTrigger>
      <AccordionContent className="text-sm leading-6">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem value={title.replace(/\s+/g, "-").toLowerCase()}>
      <AccordionTrigger className="text-left">
        <span className="font-semibold">{title}</span>
      </AccordionTrigger>
      <AccordionContent className="text-sm leading-6">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}
