import { sql } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from '@/@infra/database/drizzle/schema'

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

export async function createTestTrails(db: NodePgDatabase<typeof schema>) {
  const { randomUUID } = await import('crypto')
  const trails = [
    { id: randomUUID(), name: 'Design Digital', createdAt: new Date(), updatedAt: new Date() },
    { id: randomUUID(), name: 'Desenvolvimento', createdAt: new Date(), updatedAt: new Date() },
  ]
  await db.insert(schema.trails).values(trails)
  return trails
}