import request from 'supertest'

import { app } from '@/app.ts'
import { PrismaCommentsRepository } from '@/infra/database/prisma/repositories/comments-repository.ts'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaReportsRepository } from '@/infra/database/prisma/repositories/reports-repository.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'
import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students.ts'
import { makeComment } from 'test/factories/make-comment.ts'
import { makeProfessor } from 'test/factories/make-professor.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeSubject } from 'test/factories/make-subject.ts'

describe('delete comment (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete a comment', async () => {
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

    const response = await request(app.server)
      .delete(
        `/projects/${project.id.toString()}/comments/${comment.id.toString()}`,
      )
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })
})
