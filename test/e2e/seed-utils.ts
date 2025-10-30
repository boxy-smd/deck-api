import type { Professor } from '@/@core/domain/projects/entities/professor'
import type { Subject } from '@/@core/domain/projects/entities/subject'
import type { Trail } from '@/@core/domain/projects/entities/trail'
import { PrismaProfessorMapper } from '@/@infra/database/prisma/mappers/prisma-professor-mapper'
import { PrismaSubjectMapper } from '@/@infra/database/prisma/mappers/prisma-subject-mapper'
import { PrismaTrailMapper } from '@/@infra/database/prisma/mappers/prisma-trail-mapper'
import { PrismaService } from '@/@infra/database/prisma/prisma.service'
import type { INestApplication } from '@nestjs/common'
import { makeProfessor } from 'test/factories/make-professor'
import { makeSubject } from 'test/factories/make-subject'
import { makeTrail } from 'test/factories/make-trail'

/**
 * Cria uma trilha no banco de dados de teste
 */
export async function createTrailInDb(
  app: INestApplication,
  overrides?: Partial<{ name: string }>,
): Promise<Trail> {
  const prisma = app.get(PrismaService)
  const trail = makeTrail(overrides)
  const data = PrismaTrailMapper.toPrisma(trail)

  await prisma.trail.create({ data })

  return trail
}

/**
 * Cria uma disciplina no banco de dados de teste
 */
export async function createSubjectInDb(
  app: INestApplication,
  overrides?: Partial<{ name: string; code: string }>,
): Promise<Subject> {
  const prisma = app.get(PrismaService)
  const subject = makeSubject(overrides)
  const data = PrismaSubjectMapper.toPrisma(subject)

  await prisma.subject.create({ data })

  return subject
}

/**
 * Cria um professor no banco de dados de teste
 */
export async function createProfessorInDb(
  app: INestApplication,
  overrides?: Partial<{ name: string }>,
): Promise<Professor> {
  const prisma = app.get(PrismaService)
  const professor = makeProfessor(overrides)
  const data = PrismaProfessorMapper.toPrisma(professor)

  await prisma.professor.create({ data })

  return professor
}

/**
 * Cria dados completos para testes de projetos
 */
export async function createProjectTestData(app: INestApplication) {
  const trail = await createTrailInDb(app, { name: 'Web Development' })
  const subject = await createSubjectInDb(app, {
    name: 'Desenvolvimento Web',
    code: 'SMD0001',
  })
  const professor = await createProfessorInDb(app, { name: 'Prof. Maria' })

  return {
    trail,
    subject,
    professor,
  }
}
