import * as schema from '@/@infra/database/drizzle/schema'
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { afterAll, beforeAll } from 'vitest'
import { clearDatabase } from '../../src/@infra/database/drizzle/utils/database-cleaner'

const { Pool } = pg

const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || process.env.DATABASE_URL

if (!TEST_DATABASE_URL) {
  throw new Error('TEST_DATABASE_URL ou DATABASE_URL deve estar definida')
}

import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

let pool: pg.Pool
let db: NodePgDatabase<typeof schema>

beforeAll(() => {
  pool = new Pool({ connectionString: TEST_DATABASE_URL })
  db = drizzle(pool, { schema })
  console.log('✅ Banco de testes configurado')
})

beforeEach(async () => {
  await clearDatabase(db)
})

afterAll(async () => {
  await pool.end()
  console.log('✅ Conexões de banco fechadas')
})

export { db, pool }
