import { env } from '@/infra/config/env.ts'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/infra/database/drizzle/schema.ts',
  out: './src/infra/database/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
