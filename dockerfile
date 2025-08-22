# syntax=docker/dockerfile:1.7

############################
# Base commune
############################
FROM node:20-bookworm-slim AS base
WORKDIR /app
ENV NODE_ENV=production

############################
# Dépendances (cache npm)
############################
FROM base AS deps
# Paquets utiles pour compiler des modules natifs au build
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ pkg-config git ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
# Utilise le cache npm pour accélérer les builds
RUN --mount=type=cache,target=/root/.npm npm ci

############################
# Build Next.js
############################
FROM deps AS builder
COPY . .
# (Optionnel) Prisma : génère le client si tu l’utilises
# RUN npx prisma generate
RUN npm run build

############################
# Runtime minimal
############################
FROM base AS runner
# Outils minimalistes + libvips (sharp) + curl (healthcheck)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
# Copie le build "standalone" + assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# (Optionnel) Prisma : moteurs + schémas si nécessaires
# COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=10 CMD curl -fsS http://localhost:3000/ || exit 1
CMD ["node", "server.js"]
