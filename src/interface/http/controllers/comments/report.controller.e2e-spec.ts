import request from 'supertest'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'

import { PrismaCommentsRepository } from '@/infra/database/prisma/repositories/comments-repository'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository'
import { PrismaReportsRepository } from '@/infra/database/prisma/repositories/reports-repository'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id'
import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students'
import { makeComment } from 'test/factories/make-comment'
import { makeProject } from 'test/factories/make-project'
import { makeSubject } from 'test/factories/make-subject'

describe('report comment (e2e)', () => {
  beforeAll(async () => {
    await createTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it('should be able to report a comment', async () => {
    const app = await createTestApp()
    const { studentId, token, trail } = await createAndAuthenticateStudent()

    const subjectsRepository = new PrismaSubjectsRepository()
    const projectsRepository = new PrismaProjectsRepository()
    const reportsRepository = new PrismaReportsRepository()
    const commentsRepository = new PrismaCommentsRepository(reportsRepository)

    const subject = makeSubject()
    const project = makeProject({
      authorId: new UniqueEntityID(studentId),
      subjectId: subject.id,
      trails: new Set([trail.id]),
    })
    const comment = makeComment({
      authorId: new UniqueEntityID(studentId),
      projectId: project.id,
    })

    await subjectsRepository.create(subject)
    await projectsRepository.create(project)
    await commentsRepository.create(comment)

    const result = await request(app.getHttpServer())
      .post(`/reports/${comment.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'This comment is offensive',
        projectId: project.id.toString(),
      })

    expect(result.status).toBe(201)
    expect(result.body).toEqual({
      message: 'Comment reported successfully.',
    })
  })
})
