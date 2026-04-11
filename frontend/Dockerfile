# Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Habilitar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar arquivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar codigo fonte
COPY . .

# Build argument para API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build da aplicacao
RUN pnpm build

# Production stage
FROM nginx:alpine AS production

# Copiar configuracao do nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar arquivos buildados
COPY --from=build /app/dist /usr/share/nginx/html

# Expor porta
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
