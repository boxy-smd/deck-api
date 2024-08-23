import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import pg from 'pg'

import { env } from '@/infra/config/env.ts'
import { schema } from './schema.ts'

export let db: ReturnType<typeof drizzle<typeof schema>>

export const initDatabase = async () => {
  const pool = await new pg.Pool({
    connectionString: env.DATABASE_URL,
  })
    .connect()
    .then(client => {
      console.log('Connected to database.')
      return client
    })
    .catch(error => {
      console.log(`Failed to connect to database ${String(error)}}`)
      throw new Error(`Failed to connect to database ${String(error)}`)
    })

  db = drizzle(pool, {
    schema,
  })

  await migrate(db, {
    migrationsFolder: 'src/infra/database/drizzle/migrations',
  })
    .then(() => {
      console.log('Database migrated.')
    })
    .catch(error => {
      console.log('INIT', `Failed to migrate database ${String(error)}`)
      throw new Error(`Failed to migrate database ${String(error)}`)
    })
}
