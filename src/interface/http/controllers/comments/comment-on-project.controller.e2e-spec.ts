import request from 'supertest'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'

import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id'
import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students'
import { makeProject } from 'test/factories/make-project'
import { makeSubject } from 'test/factories/make-subject'

describe('comment on project (e2e)', () => {
  beforeAll(async () => {
    await createTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it('should be able to comment on project', async () => {
    const app = await createTestApp()
    const { studentId, token, trail } = await createAndAuthenticateStudent()

    const subjectsRepository = new PrismaSubjectsRepository()
    const projectsRepository = new PrismaProjectsRepository()

    const subject = makeSubject()
    const project = makeProject({
      authorId: new UniqueEntityID(studentId),
      subjectId: subject.id,
      trails: new Set([trail.id]),
    })

    await subjectsRepository.create(subject)
    await projectsRepository.create(project)

    const result = await request(app.getHttpServer())
      .post(`/projects/${project.id.toString()}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'This is a comment.',
      })

    expect(result.status).toBe(201)
    expect(result.body).toEqual({
      comment_id: expect.any(String),
    })
  })
})
