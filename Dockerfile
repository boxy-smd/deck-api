# Build stage
FROM node:20-alpine AS builder

# Install system dependencies
RUN apk add --no-cache openssl libc6-compat

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.17.0 --activate

WORKDIR /app

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install dependencies (including dev)
RUN pnpm install --frozen-lockfile

# Copy source code and configs
COPY . .

# Generate Drizzle types and build (skip tests/typecheck)
RUN pnpm db:generate && pnpm build:prod

# Production stage
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl libc6-compat curl

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.17.0 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies + tsx (needed for migrations)
RUN pnpm install --prod --frozen-lockfile && pnpm add tsx

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle

# Copy migration and seed scripts
COPY --from=builder /app/src/@infra/database/drizzle/migrate.ts ./src/@infra/database/drizzle/migrate.ts
COPY --from=builder /app/src/@infra/database/drizzle/seed.ts ./src/@infra/database/drizzle/seed.ts
COPY --from=builder /app/src/@infra/database/drizzle/schema.ts ./src/@infra/database/drizzle/schema.ts

# Copy drizzle config (needed for migrations)
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3333/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application (with migrations)
CMD ["sh", "-c", "pnpm db:migrate && pnpm start"]




