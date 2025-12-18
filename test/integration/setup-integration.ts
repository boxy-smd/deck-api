import { afterAll, beforeAll } from 'vitest'
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from '@/@infra/database/drizzle/schema'

const { Pool } = pg

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL

if (!TEST_DATABASE_URL) {
  throw new Error('TEST_DATABASE_URL ou DATABASE_URL deve estar definida')
}

let pool: pg.Pool
let db: ReturnType<typeof drizzle>

beforeAll(async () => {
  pool = new Pool({ connectionString: TEST_DATABASE_URL })
  db = drizzle(pool, { schema })
  console.log('✅ Banco de testes configurado')
})

afterAll(async () => {
  await pool.end()
  console.log('✅ Conexões de banco fechadas')
})

export { db, pool }