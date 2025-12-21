import { sql } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from '../schema'

export async function clearDatabase(db: NodePgDatabase<typeof schema>) {
  await db.execute(sql`TRUNCATE TABLE reports CASCADE`)
  await db.execute(sql`TRUNCATE TABLE comments CASCADE`)
  await db.execute(sql`TRUNCATE TABLE project_professors CASCADE`)
  await db.execute(sql`TRUNCATE TABLE project_trails CASCADE`)
  await db.execute(sql`TRUNCATE TABLE projects CASCADE`)
  await db.execute(sql`TRUNCATE TABLE student_has_trail CASCADE`)
  await db.execute(sql`TRUNCATE TABLE student_profiles CASCADE`)
  await db.execute(sql`TRUNCATE TABLE users CASCADE`)
  await db.execute(sql`TRUNCATE TABLE professors CASCADE`)
  await db.execute(sql`TRUNCATE TABLE subjects CASCADE`)
  await db.execute(sql`TRUNCATE TABLE trails CASCADE`)
}

export async function truncateDatabase(db: NodePgDatabase<typeof schema>) {
  const tables = [
    'reports',
    'comments',
    'project_professors',
    'project_trails',
    'projects',
    'student_has_trail',
    'student_profiles',
    'users',
    'professors',
    'subjects',
    'trails',
  ]

  for (const table of tables) {
    await db.execute(sql.raw(`TRUNCATE TABLE "${table}" CASCADE`))
  }
}
