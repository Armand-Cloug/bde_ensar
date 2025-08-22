# BDE ENSAR — App (Next.js 14 / App Router)

Site du BDE ENSAR : authentification (credentials + Google), adhésions Stripe, panel admin (utilisateurs, alumnis, BDE, événements, galerie, partenariats…), pages publiques (accueil, à propos, contact, événements, adhésion) et intégrations (email, webhook Stripe).

---

## 🧱 Stack & principes

* **Next.js 14** (App Router), **TypeScript**
* **Prisma** (PostgreSQL recommandé) + **@prisma/client**
* **next-auth** (JWT strategy) : Credentials + Google
* **shadcn/ui** + **Tailwind CSS**
* **Stripe** (Checkout + Webhook) pour les adhésions
* **Email** (Resend / SMTP) : contact & reset password
* **Règles d’accès** par rôle & statut (`admin`, `isAdherent`, `isAlumni`)

---

## 📁 Structure (extraits)

```
src/
  app/
    (public)/
      page.tsx                  # Accueil (sections animées)
      apropos/page.tsx          # Équipe BDE active + partenaires
      contact/page.tsx          # Formulaire + réseaux + coordonnées
      adhesion/page.tsx         # Adhésion Stripe (UX)
      event/page.tsx            # Liste des événements actifs & à venir
      event/[slug]/page.tsx     # Page détaillée d’un événement
      not-found.tsx             # 404 custom

    (dashboard)/
      admin/page.tsx            # Gate d’accès + AdminPanel

    api/
      auth/[...nextauth]/route.ts
      checkout/adhesion/route.ts           # Stripe Checkout
      stripe/webhook/route.ts              # Webhook Stripe
      contact/route.ts                     # Email contact
      password/request/route.ts            # Demande reset password
      password/reset/route.ts              # Réinit. mot de passe
      user/complete-profile/route.ts       # Onboarding (nom/prénom Google)

      admin/
        users/route.ts                     # listing paginé users (SSR API)
        events/route.ts                    # GET (list) / POST (create)
        events/[id]/route.ts               # GET / PATCH / DELETE
        events/[id]/page/route.ts          # GET / PUT (slug auto + texte)
        # bde/, alumni/, partners/ … (si activés)

  components/
    Header.tsx, Footer.tsx
    navbar/MainNav.tsx, navbar/MobileNav.tsx
    admin/AdminPanel.tsx
    admin/tabs/
      AccountTab.tsx
      UsersTab.tsx
      AlumniTab.tsx
      BdeTab.tsx
      EventsTab.tsx
      GalleryTab.tsx
      PartnersTab.tsx
      AnalTab.tsx
      events/                 # découpage de l’onglet Événements
        HeaderBar.tsx
        EventsTable.tsx
        CreateEventDialog.tsx
        EditEventDialog.tsx
        EventPageDialog.tsx
        types.ts
        useDebounced.ts
    apropos/MembersCarousel.tsx
    apropos/PartnersMarquee.tsx (client)
    contact/ContactForm.tsx
    account/* (EditFieldMenu, ChangePasswordButton, etc.)
    ui/* (shadcn components)

  lib/
    auth.ts                   # next-auth options (JWT, callbacks, pages)
    db.ts                     # Prisma client
    mail.ts                   # Email client (Resend/SMTP)
```

> ⚠️ `middleware.ts` doit être à la **racine du repo** (pas dans `lib/`). Il protège par ex. `/admin`.

---

## 🚀 Démarrage

1. **Installer**

```bash
pnpm i
# ou npm i / yarn
```

2. **Variables d’env.** (`.env.local`)

```dotenv
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=xxx

# Google OAuth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=yyy

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_ADHESION_PRICE_CENTS=1500  # 15€ (défini côté serveur)

# Emails
RESEND_API_KEY=re_xxx              # (ou config SMTP alternative)
BDE_EMAIL=bde.ensar.contact@gmail.com
BDE_ADDRESS=Campus de Niort, ...

# Next/Image (si images externes)
NEXT_PUBLIC_IMAGE_DOMAINS=i.goopics.net,images.unsplash.com
```

3. **Prisma**

```bash
npx prisma generate
npx prisma migrate dev -n init
```

4. **Lancer**

```bash
pnpm dev
```

---

## 🗄️ Modèle de données (principaux)

* **User**

  * `firstName`, `lastName`, `email`, `image`, `promotion`, `birthdate`, `company`
  * `role` (par défaut `"utilisateur"`, mettre `"admin"` pour admin)
  * `isAdherent` (bool), `adhesionStart`, `adhesionEnd`
  * `isAlumni` (bool)
* **AlumniRequest**: `userId`, `diplome`, `anneeObtention`, `statut ('en_attente'|'valide'|'refuse')`
* **BdeTeam**: `annee` (unique), `description`, `image`, `isActive` (bool)
* **BdeTeamMember**: `teamId`, `userId`, `poste`, `photo`, `description`
* **Partner** (si activé): `name`, `website?`, `logoUrl?`, `isActive`
* **Event**: `title`, `description` (obligatoire), `date`, `location?`, `inscriptionLink?`, `image?`, `isActive`
* **EventPage**: `eventId`, `slug` (unique), `contentHtml` (**stocke un TEXTE simple**)

  * **Slug auto** côté API au format `event-xxxxxxxx`
* **VerificationToken**: reset password
* **Account / Session**: next-auth

---

## 🔐 Authentification & rôles

* **next-auth** (JWT)

  * Providers: **Credentials** & **Google**
  * **Onboarding Google** : si `firstName/lastName` manquants → `/onboarding` (`/api/user/complete-profile`).
* **Session JWT** augmentée :

  * `user.id`, `role`, `isAdherent`, `isAlumni`, `firstName`, `lastName`
* **Accès**

  * `/admin` : **admin** uniquement
  * Page **Adhésion** : visible pour **non connectés** et connectés **non adhérents** (admin voit tout)
  * Page **Anal** : **adhérents** + **admin**
  * Navbars conditionnelles (Main/Mobile) selon `role` / `isAdherent`.

---

## 💳 Adhésions (Stripe)

* **Checkout** : `POST /api/checkout/adhesion`

  * Prix **défini serveur** via `STRIPE_ADHESION_PRICE_CENTS`
* **Webhook** : `POST /api/stripe/webhook`

  * Sur `checkout.session.completed` → `isAdherent = true`, `adhesionStart = now`, `adhesionEnd = prochain 1er septembre`
* **UX** `/adhesion` :

  * Si déjà adhérent → redirect `/`
  * Si `success=1` → redirect `/` (évite double paiement)

> **Local webhook** : `stripe listen --forward-to http://localhost:3000/api/stripe/webhook`
> Copier le secret dans `STRIPE_WEBHOOK_SECRET`.

---

## ✉️ Emails

* **Contact** : `POST /api/contact` → email au **BDE** + **accusé** à l’expéditeur
* **Reset password** :

  * `POST /api/password/request` : crée un `VerificationToken` + email lien
  * `POST /api/password/reset` : vérifie et remplace le mot de passe

---

## 🧩 Admin Panel (Sections)

Entrée `/admin` (Server Component) → **AdminPanel** (Client)

* **Mon compte** : infos + actions (déconnexion, demande alumni, changer mot de passe)
* **Utilisateurs** : data table paginée (Nom / Prénom / Email), recherche côté serveur
* **Alumnis** : liste + demandes (valider/refuser) — si activé
* **BDE** : équipes, membres, **équipe active**
* **Partenariats** : logos & liens (marquee sur À propos)
* **Événements**

  * Liste (Nom / Date / Lieu / Actif) + recherche + pagination
  * Créer (dialog) — `description` requise
  * Menu `⋯` : Voir/Modifier, **Gérer la page** (slug auto + **texte simple**), Supprimer
  * Découpage : `components/admin/tabs/events/*`

---

## 🌐 Pages publiques

* **Accueil** : sections animées (ENSAR, BDE, formations, Niort, événements, adhésion, alumnis, stages)
* **À propos** : équipe active (photo + description), **membres** (carousel), **partenaires** (marquee)
* **Contact** : formulaire + réseaux + coordonnées (envoyé via `/api/contact`)
* **Adhésion** : CTA Stripe + avantages (guards)
* **Événements**

  * `/event` : événements **actifs & à venir** (image, titre, date, lieu, lien)
  * `/event/[slug]` : détail (image, titre, date, lieu, description) + **contenu texte** (stocké dans `contentHtml`)

---

## 🎨 UI / Thème

* **shadcn/ui** (Button, Card, Table, Tabs, Select, Dialog, Dropdown, Switch, Textarea, Sheet, Avatar, Toaster…)
* **Tailwind** + **thème orange** : `bg-amber-500/600`, badges `bg-orange-50 text-orange-700`, halos flous orange
* Navbar Desktop : soulignement orange de la page active
* Navbar Mobile : item actif dans un **pills** orange

---

## 🔧 Scripts utiles

```bash
# Prisma
npx prisma generate
npx prisma migrate dev -n <name>
npx prisma studio

# Dev
pnpm dev
pnpm build && pnpm start
```

---

## 🧪 Tips / Débogage

* `middleware.ts` **à la racine** du repo (sinon non pris en compte)
* Images externes → ajouter domaines dans `next.config.mjs` (`images.domains`) ou utiliser `<img>`
* Prisma search : adapter si `mode: 'insensitive'` non supporté selon DB/Version
* Créer un admin : via Prisma Studio → `user.role = "admin"`
* Stripe : `stripe listen` requis en local

---

## 🔐 RGPD / CNIL

* Données personnelles limitées au nécessaire (nom, prénom, email, etc.)
* Bases légales : exécution du contrat (adhésion), intérêt légitime (vie associative), consentement (newsletter si ajoutée)
* Durées de conservation à documenter (ex. historique d’adhésions N années)
* Droits : accès, rectification, suppression, opposition
* Contact DPO : à définir si nécessaire
* Aucune donnée sensible (santé, opinions…)
* Carte des stages : **uniquement** des infos **publiques** sur l’entreprise (pas de données privées)

---

## ✅ Roadmap (idées)

* Éditeur riche pour `EventPage` (`contentJson`) + rendu stylé
* Flux complet alumnis (validation admin + badge profil)
* Galerie avec upload (S3/R2) + modération
* Intégration HelloAsso pour événements
* Carte des stages (Leaflet/Mapbox) + CRUD admin + retours d’expérience

---

**Auteur :** BDE ENSAR — Dev : Cloug
**Licence :** privée (interne BDE) — à préciser si nécessaire.
