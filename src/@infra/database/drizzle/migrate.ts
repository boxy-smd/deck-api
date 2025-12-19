import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'

// Load environment variables
config({ path: '.env' })

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  console.log('🔄 Running database migrations...')

  const pool = new Pool({
    connectionString,
  })

  const db = drizzle(pool)

  try {
    await migrate(db, {
      migrationsFolder: './drizzle',
    })

    console.log('✅ Migrations completed successfully')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await pool.end()
  }
}

runMigrations()
