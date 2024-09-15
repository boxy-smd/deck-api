import request from 'supertest'

import { app } from '@/app.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { PrismaCommentsRepository } from '@/infra/database/prisma/repositories/comments-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'
import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students.ts'
import { makeComment } from 'test/factories/make-comment.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeSubject } from 'test/factories/make-subject.ts'

describe('report comment (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to report a comment', async () => {
    const { studentId, token, trail } = await createAndAuthenticateStudent()

    const subjectsRepository = new PrismaSubjectsRepository()
    const projectsRepository = new PrismaProjectsRepository()
    const commentsRepository = new PrismaCommentsRepository()

    const subject = makeSubject()
    const project = makeProject({
      authorId: new UniqueEntityID(studentId),
      subjectId: subject.id,
      trails: [trail],
    })
    const comment = makeComment({
      authorId: new UniqueEntityID(studentId),
      projectId: project.id,
    })

    await subjectsRepository.create(subject)
    await projectsRepository.create(project)
    await commentsRepository.create(comment)

    const result = await request(app.server)
      .post(`/reports/${comment.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'This comment is offensive',
      })

    expect(result.status).toBe(201)
    expect(result.body).toEqual({
      message: 'Comment reported successfully.',
    })
  })
})
