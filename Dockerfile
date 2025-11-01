FROM node:20-alpine

# Instalar dependências do sistema
RUN apk add --no-cache openssl libc6-compat

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar todas as dependências
RUN pnpm install --frozen-lockfile

# Copiar código
COPY . .

# Gerar Prisma Client
RUN pnpm db:generate

# Build da aplicação
RUN pnpm build

EXPOSE 3333

# Executar migrations, seed e iniciar
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx prisma/seed.ts && pnpm start"]




