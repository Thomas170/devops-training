
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
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# ==========================================
# 3. ÉTAPE BUILDER (Compilation Prod)
# ==========================================
FROM base AS builder
ENV NODE_ENV=production
# Arguments de build passés par la CI/CD si besoin (ex: VITE_API_URL)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# 1. On copie d'abord tout le code (y compris package-lock.json)
COPY . .

# 2. Ensuite on lance l'installation propre
RUN npm install --include=dev

# 3. Enfin on compile
RUN npm run build

# ==========================================
# 4. ÉTAPE PRODUCTION (Serveur statique sécurisé)
# ==========================================cd 
FROM nginx:1.25-alpine-slim AS production

# Optimisation Nginx et nettoyage des fichiers par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copie des assets compilés depuis l'étape builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Ajustement des permissions pour exécuter Nginx en non-root si nécessaire
RUN chown -R nginx:nginx /usr/share/nginx/html && \
		chmod -R 755 /usr/share/nginx/html

# Bascule sur l'utilisateur non-root Nginx
USER nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
	CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
