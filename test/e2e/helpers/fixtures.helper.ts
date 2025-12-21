import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from '@/@infra/database/drizzle/schema'

/**
 * Popula o banco de dados com dados de teste comuns
 */
export async function seedCommonData(db: NodePgDatabase<typeof schema>) {
  // Cria trilhas padrão
  const trails = [
    {
      id: crypto.randomUUID(),
      name: 'Design Digital',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Audiovisual',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Sistemas da Informação',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  await db.insert(schema.trails).values(trails)

  // Cria professores padrão
  const professors = [
    {
      id: crypto.randomUUID(),
      name: 'Prof. João Silva',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Profa. Maria Santos',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  await db.insert(schema.professors).values(professors)

  // Cria disciplinas padrão
  const subjects = [
    {
      id: crypto.randomUUID(),
      code: 'SMD001',
      name: 'Introdução à Programação',
      workload: 64,
      semester: 1,
      type: 'OBLIGATORY' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      code: 'SMD002',
      name: 'Design de Interfaces',
      workload: 64,
      semester: 2,
      type: 'OBLIGATORY' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  await db.insert(schema.subjects).values(subjects)

  return { trails, professors, subjects }
}
