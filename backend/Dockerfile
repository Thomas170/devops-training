# ==========================================
# 1. ÉTAPE COMMUNE (Base)
# ==========================================
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ==========================================
# 2. ÉTAPE DEVELOPPEMENT (Dev Local avec Hot-reload)
# ==========================================
FROM base AS development
ENV NODE_ENV=development
# En dev, on installe tout (y compris nodemon ou autres outils de dev)
RUN npm install
COPY . .
EXPOSE 3000
# On utilise le mode watch natif de Node 20 (ou "npm run dev" si tu as mis nodemon dans ton package.json)
CMD ["node", "--watch", "index.js"]

# ==========================================
# 3. ÉTAPE BUILDER (Préparation Prod)
# ==========================================
FROM base AS builder
ENV NODE_ENV=production
# Installation propre uniquement des dépendances de prod
RUN npm ci --omit=dev
COPY . .

# ==========================================
# 4. ÉTAPE PRODUCTION (Runtime minimaliste & sécurisé)
# ==========================================
FROM node:20-alpine AS production
WORKDIR /app

# Création de l'utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copie depuis le builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/index.js ./index.js
COPY --from=builder /app/package.json ./package.json

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "index.js"]