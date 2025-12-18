import { sql } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type { INestApplication } from '@nestjs/common'

import * as schema from '@/@infra/database/drizzle/schema'
import { getDrizzleInstance } from './helpers/drizzle.helper'

/**
 * Limpa todas as tabelas do banco de dados de teste
 * IMPORTANTE: A ordem de exclusão respeita as foreign keys
 *
 * Aceita tanto a instância do Drizzle quanto a app do NestJS
 */
export async function clearDatabase(
  dbOrApp: NodePgDatabase<typeof schema> | INestApplication,
): Promise<void> {
  // Se for INestApplication, obtém a instância do Drizzle
  const db = 'get' in dbOrApp ? getDrizzleInstance(dbOrApp) : dbOrApp

  // Ordem de exclusão respeitando foreign keys
  await db.delete(schema.reports)
  await db.delete(schema.comments)
  await db.delete(schema.projectProfessors)
  await db.delete(schema.projectTrails)
  await db.delete(schema.projects)
  await db.delete(schema.studentHasTrail)
  await db.delete(schema.studentProfiles)
  await db.delete(schema.users)
  await db.delete(schema.professors)
  await db.delete(schema.subjects)
  await db.delete(schema.trails)
}

/**
 * Limpa todas as tabelas usando TRUNCATE CASCADE (mais rápido)
 * Use quando não houver necessidade de triggers ou cascatas manuais
 *
 * Aceita tanto a instância do Drizzle quanto a app do NestJS
 */
export async function truncateDatabase(
  dbOrApp: NodePgDatabase<typeof schema> | INestApplication,
): Promise<void> {
  // Se for INestApplication, obtém a instância do Drizzle
  const db = 'get' in dbOrApp ? getDrizzleInstance(dbOrApp) : dbOrApp

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
