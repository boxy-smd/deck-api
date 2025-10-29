import request from 'supertest'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'

import { PrismaCommentsRepository } from '@/infra/database/prisma/repositories/comments-repository'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository'
import { PrismaReportsRepository } from '@/infra/database/prisma/repositories/reports-repository'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id'
import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students'
import { makeComment } from 'test/factories/make-comment'
import { makeProfessor } from 'test/factories/make-professor'
import { makeProject } from 'test/factories/make-project'
import { makeSubject } from 'test/factories/make-subject'

describe('delete comment (e2e)', () => {
  beforeAll(async () => {
    await createTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it('should be able to delete a comment', async () => {
    const app = await createTestApp()
    const { studentId, token, trail } = await createAndAuthenticateStudent()

    const professorsRepository = new PrismaProfessorsRepository()
    const subjectsRepository = new PrismaSubjectsRepository()
    const projectsRepository = new PrismaProjectsRepository()
    const reportsRepository = new PrismaReportsRepository()
    const commentsRepository = new PrismaCommentsRepository(reportsRepository)

    const professor = makeProfessor({
      name: 'Ticianne de Gois Ribeiro Darin',
    })

    const subject = makeSubject({
      name: 'Interação Humano-Computador I',
    })

    const project = makeProject({
      authorId: new UniqueEntityID(studentId),
      trails: new Set([trail.id]),
    })

    await professorsRepository.create(professor)
    await subjectsRepository.create(subject)
    await projectsRepository.create(project)

    const comment = makeComment({
      authorId: new UniqueEntityID(studentId),
      projectId: project.id,
    })

    await commentsRepository.create(comment)

    const response = await request(app.getHttpServer())
      .delete(
        `/projects/${project.id.toString()}/comments/${comment.id.toString()}`,
      )
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })
})
