import { type INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { config } from 'dotenv'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { beforeAll } from 'vitest'
import { AppModule } from '@/@presentation/app.module'
import * as schema from '../../src/@infra/database/drizzle/schema'
import { truncateDatabase } from '../../src/@infra/database/drizzle/utils/database-cleaner'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

// Cleanup database before all E2E tests in a file run
beforeAll(async () => {
  const DATABASE_URL = process.env.DATABASE_URL
  if (DATABASE_URL) {
    const pool = new pg.Pool({ connectionString: DATABASE_URL })
    const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>
    await truncateDatabase(db)
    await pool.end()
    console.log('[Setup] Database truncated for E2E tests')
  }
})

export async function createTestApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, {
    // Enable logger to debug 500 errors
    logger: ['error', 'warn', 'log'],
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  await app.init()

  return app
}

// Sem isolamento - usa schema public diretamente
beforeAll(() => {
  console.log('[Setup] Using public schema for E2E tests')
})
