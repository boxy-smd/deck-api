import type { INestApplication } from '@nestjs/common'

import { ProfessorsRepository } from '@/@core/application/professors/repositories/professors-repository'
import { SubjectsRepository } from '@/@core/application/subjects/repositories/subjects-repository'
import { TrailsRepository } from '@/@core/application/trails/repositories/trails-repository'
import { Professor } from '@/@core/domain/projects/entities/professor'
import { Subject } from '@/@core/domain/projects/entities/subject'
import { Trail } from '@/@core/domain/projects/entities/trail'
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
    const existing = await repo.findManyByName(overrides.name)
    // findManyByName returns array. Exact match?
    // Drizzle Repo implementation uses ilike %name%.
    // Existing logic was 'findFirst where name = overrides.name'.
    // Repo doesn't have `findByName`. It has `findManyByName`.
    // Wait, ProfessorsRepository interface has `findManyByName`. Does it have `findByName`?
    // I need to check interface or implementation.
    // DrizzleProfessorsRepository creates `findManyByName`.
    // It does NOT implement `findByName`?
    // Let me check `DrizzleProfessorsRepository` again.
    // I implemented `findManyByName`.
    // Existing interface `ProfessorsRepository` (viewed in Step 623) has `findManyByName` only (besides CRUD).
    // Wait, earlier I saw `findByName` in `TrailsRepository` and `SubjectsRepository`.
    // ProfessorsRepository on line 21: `abstract findManyByName(name: string): Promise<Professor[]>`
    // No `findByName` unique?
    // So simple exact match might not be directly supported by repo interface.
    // I should iterate or just always create for now?
    // But uniqueness is needed for idempotency.
    // I can use `findManyByName` and filter in JS for exact match.

    // Actually, I can rely on `findManyByName` returning something and assume it's the one if name matches exactly?
    // Let's implement exact match check.
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
