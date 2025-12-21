import type { INestApplication } from '@nestjs/common'
import { makeProfessor } from 'test/factories/make-professor'
import { makeSubject } from 'test/factories/make-subject'
import { makeTrail } from 'test/factories/make-trail'
import { ProfessorsRepository } from '@/@core/application/professors/repositories/professors-repository'
import { SubjectsRepository } from '@/@core/application/subjects/repositories/subjects-repository'
import { TrailsRepository } from '@/@core/application/trails/repositories/trails-repository'
import { Professor } from '@/@core/domain/projects/entities/professor'
import { Subject } from '@/@core/domain/projects/entities/subject'
import { Trail } from '@/@core/domain/projects/entities/trail'

/**
 * Cria uma trilha no banco de dados de teste
 */
export async function createTrailInDb(
  app: INestApplication,
  overrides?: Partial<{ name: string }>,
): Promise<Trail> {
  const repo = app.get(TrailsRepository)

  if (overrides?.name) {
    const existing = await repo.findByName(overrides.name)
    if (existing) {
      return existing
    }
  }

  const trail = makeTrail(overrides)
  await repo.create(trail)

  return trail
}

/**
 * Cria uma disciplina no banco de dados de teste
 */
export async function createSubjectInDb(
  app: INestApplication,
  overrides?: Partial<{ name: string; code: string }>,
): Promise<Subject> {
  const repo = app.get(SubjectsRepository)

  if (overrides?.name) {
    const existing = await repo.findByName(overrides.name)
    if (existing) {
      return existing
    }
  }

  const subject = makeSubject(overrides)
  await repo.create(subject)

  return subject
}

/**
 * Cria um professor no banco de dados de teste
 */
export async function createProfessorInDb(
  app: INestApplication,
  overrides?: Partial<{ name: string }>,
): Promise<Professor> {
  const repo = app.get(ProfessorsRepository)

  if (overrides?.name) {
    // findManyByName returns array; implementation uses ilike %name%.
    // To keep idempotency, check for an exact name match among candidates.
    const candidates = await repo.findManyByName(overrides.name)
    const exact = candidates.find(p => p.name === overrides.name)
    if (exact) return exact
  }

  const professor = makeProfessor(overrides)
  await repo.create(professor)

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
