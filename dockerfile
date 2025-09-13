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
# ⚠️ Empêche le postinstall Prisma de s'exécuter sans schema
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ pkg-config git ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

############################
# Build Next.js
############################
FROM deps AS builder
COPY . .
# ✅ Génère Prisma APRES avoir le dossier prisma/
RUN npx prisma generate
RUN npm run build

############################
# Runtime minimal
############################
FROM base AS runner
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips curl ca-certificates && rm -rf /var/lib/apt/lists/*
# Copie le build "standalone" + assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# ✅ Copie les moteurs Prisma et le schema (indispensable au runtime)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=10 CMD curl -fsS http://localhost:3000/ || exit 1
CMD ["node", "server.js"]