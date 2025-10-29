import request from 'supertest'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'

import { PrismaProfessorsRepository } from '@/@infra/database/prisma/repositories/professors-repository'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'
import { PrismaSubjectsRepository } from '@/@infra/database/prisma/repositories/subjects-repository'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students'
import { makeProfessor } from 'test/factories/make-professor'
import { makeProject } from 'test/factories/make-project'
import { makeSubject } from 'test/factories/make-subject'

describe('delete project (e2e)', () => {
  beforeAll(async () => {
    await createTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it('should be able to delete a project', async () => {
    const app = await createTestApp()
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

    const response = await request(app.getHttpServer())
      .delete(`/projects/${project.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })
})
