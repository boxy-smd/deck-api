import request from 'supertest'

import { app } from '@/app.ts'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'
import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students.ts'
import { makeProfessor } from 'test/factories/make-professor.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeSubject } from 'test/factories/make-subject.ts'

describe('delete project (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete a project', async () => {
    const { studentId, token, trail } = await createAndAuthenticateStudent()

    const professorsRepository = new PrismaProfessorsRepository()
    const subjectsRepository = new PrismaSubjectsRepository()
    const projectsRepository = new PrismaProjectsRepository()

    const professor = makeProfessor({
      name: 'Ticianne de Gois Ribeiro Darin',
    })

    const subject = makeSubject({
      name: 'Interação Humano-Computador I',
    })

    const project = makeProject({
      authorId: new UniqueEntityID(studentId),
      subjectId: subject.id,
      trails: new Set([trail.id]),
    })

    await professorsRepository.create(professor)
    await subjectsRepository.create(subject)
    await projectsRepository.create(project)

    const response = await request(app.server)
      .delete(`/projects/${project.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })
})
