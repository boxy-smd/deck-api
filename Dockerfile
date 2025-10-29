FROM node:20-alpine

# Instalar dependências necessárias para Prisma
RUN apk add --no-cache openssl libc6-compat

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código da aplicação
COPY . .

# Gerar Prisma Client
RUN pnpm db:generate

# Build da aplicação
RUN pnpm build

# Expor porta
EXPOSE 3333

# Iniciar com migrações e seed
CMD ["sh", "-c", "pnpm db:deploy && npx tsx prisma/seed.ts && node build/server.js"]
