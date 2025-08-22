# 🚀 Déploiement Next.js + Traefik (HTTPS) + MariaDB

*Guide officiel pour déployer votre application Next.js derrière Traefik (certificats Let’s Encrypt automatiques) avec MariaDB, et l’automatiser via GitHub Actions — **en un clic**.*

---

## 🧭 Sommaire

1. [Aperçu de l’architecture](#aperçu-de-larchitecture)
2. [Pré‑requis](#pré-requis)
3. [Arborescence du dépôt](#arborescence-du-dépôt)
4. [Variables d’environnement](#variables-denvironnement)
5. [Rôle des fichiers](#rôle-des-fichiers)
6. [Mise en place](#mise-en-place)
7. [Déploiement 1‑clic (CI/CD)](#déploiement-1-clic-cicd)
8. [Opérations courantes](#opérations-courantes)
9. [Dépannage](#dépannage)
10. [Bonnes pratiques sécurité](#bonnes-pratiques-sécurité)
11. [Rollback (en cas d’échec)](#rollback-en-cas-déchec)

---

## 🏗️ Aperçu de l’architecture

* **web** → Application **Next.js** (build `output: 'standalone'`) exposée en interne.
* **traefik** → Reverse proxy en frontal : gère **HTTP→HTTPS** et les certificats **Let’s Encrypt** (HTTP‑01).
* **db** → **MariaDB** (non exposée publiquement), persistée via volume.

> Les certificats sont stockés dans un **volume Docker** : **pas besoin** de dossier `traefik/` dans le dépôt.

---

## ✅ Pré‑requis

* Un **domaine** pour le site (ex. `bde-ensar.fr`) pointant vers l’IP du serveur.
* Serveur **Debian 12/13** avec ports **80/443** ouverts (et **22** pour SSH).
* Accès au dépôt **GitHub** et aux **GitHub Actions**.

---

## 🗂️ Arborescence du dépôt

```
.
├─ Dockerfile
├─ docker-compose.yml
├─ next.config.ts
├─ .env.example
└─ .github/
   └─ workflows/
      └─ deploy.yml
```

---

## 🔧 Variables d’environnement

> Renseignez votre `.env` (non committé) d’après **`.env.example`**. Le pipeline génère le `.env` **sur le serveur** à partir des **Secrets** et **Variables** GitHub.

### Secrets GitHub (obligatoires selon vos features)

* `SERVER_HOST`, `SERVER_USER`, `SERVER_SSH_KEY` (déploiement SSH)
* `DB_PASSWORD`, `NEXTAUTH_SECRET`
* `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` *(OAuth)*
* `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` *(paiements)*
* `SMTP_PASS` *(emails)*
* `INSTAGRAM_GRAPH_TOKEN` *(si utilisé)*

### Variables GitHub (non sensibles)

* **Infra / Traefik** : `DOMAIN`, `TRAEFIK_ACME_EMAIL`
* **DB** : `DB_NAME`, `DB_USER`, `DATABASE_URL_DEV` *(optionnel)*
* **App** : `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`, `STRIPE_ADHESION_PRICE_CENTS`
* **SMTP** : `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_FROM`

> En prod, l’URL DB est construite par le pipeline :
> `mysql://$DB_USER:$DB_PASSWORD@db:3306/$DB_NAME`

---

## 📄 Rôle des fichiers

* **`Dockerfile`** : Build multi‑étapes Next.js (support modules natifs). Runtime léger.
* **`docker-compose.yml`** : Définit **traefik**, **web** (labels Traefik inclus) et **db**.
* **`next.config.ts`** : Doit contenir `output: 'standalone'` + options prod (strict mode, images, etc.).
* **`.env.example`** : Référence de toutes les variables (prod/dev). **Ne commitez pas** le `.env`.
* **`.github/workflows/deploy.yml`** : Pipeline de **déploiement total** en 1 clic.

> ⚠️ Ce README **n’inclut pas** le code complet des fichiers (ils sont déjà dans le repo).

---

## 🚀 Mise en place

1. **DNS** : créez un enregistrement **A** pour `DOMAIN` → IP du serveur.
2. **Firewall** : ouvrez les ports **80/443** (et **22** pour SSH).
3. **Secrets & Variables GitHub** : renseignez les valeurs listées plus haut.
4. **(Optionnel) Test manuel** sur le serveur :

   * `docker compose config` pour valider la syntaxe.
   * `docker compose up -d --build` pour lancer la stack.

---

## 🟢 Déploiement 1‑clic (CI/CD)

Deux façons de déclencher :

* **Push** sur la branche `main` ; ou
* **Actions → Deploy to Server → Run workflow**.

Le pipeline exécute automatiquement :

1. Synchronisation du dépôt vers `~/app` sur le serveur.
2. Installation de **Docker/Compose** si absents (Debian 12/13).
3. **Génération du `.env`** sur le serveur à partir des Secrets/Variables.
4. `docker compose up -d --build` (Traefik + Next.js + MariaDB).
5. **(Auto)** Si un dossier `prisma/` existe : `prisma migrate deploy` puis restart du service web.
6. Affichage de l’état des conteneurs.

> Résultat : site servi en **HTTPS** (Let’s Encrypt) derrière **Traefik**, sans action manuelle supplémentaire.

---

## 🔁 Opérations courantes

* **Vérifier la configuration Compose** : `docker compose config`
* **Voir les services** : `docker ps`
* **Logs** : `docker logs -f traefik` / `docker logs -f nextjs_app`
* **Restart app** : `docker compose restart web`
* **Rebuild** : `docker compose up -d --build`
* **Arrêt** : `docker compose down`

> **Backups DB** : planifier un `mysqldump` quotidien (ex. via cron) vers un stockage externe.

---

## 🧯 Dépannage

* **Let’s Encrypt non émis** :

  * `DOMAIN` pointe bien sur l’IP du serveur ?
  * Port **80** ouvert (HTTP‑01) ?
  * Pas de proxy CDN qui intercepte la requête ACME ?
* **Erreur YAML / indentation** : `docker compose config` indique la ligne fautive.
* **DB inaccessible** : vérifier `DB_NAME/USER/PASSWORD` et que l’URL cible `db:3306`.
* **Next.js ne démarre pas** : `output: 'standalone'` dans `next.config.ts` puis rebuild.
* **Traefik** : consulter `docker logs -f traefik`.

---

## 🔐 Bonnes pratiques sécurité

* **Secrets** uniquement dans **GitHub Secrets** — jamais en clair dans le repo.
* Ne pas exposer **3306** (aucun `ports:` pour `db`).
* Mettre à jour régulièrement les images (`docker compose pull`).
* Rotation de clés/secrets et sauvegardes régulières.

---

## ↩️ Rollback (en cas d’échec)

* **Le plus simple** : revenir au **commit précédent** et relancer le workflow (le pipeline rebuild et redéploie l’état antérieur).
* **Alternative** : ajouter un tag d’image (ex. `web:prod-YYYYMMDD`) et conserver N versions — bonne pratique à mettre en place plus tard si besoin de SLA.

---

**Fin.** Votre dépôt contient déjà tout le nécessaire — suivez ces étapes pour un déploiement fiable, automatisé et sécurisé en HTTPS. 💪
