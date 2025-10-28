import request from 'supertest'

import { app } from '@/app.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'
import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeSubject } from 'test/factories/make-subject.ts'

describe('comment on project (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to comment on project', async () => {
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

    const result = await request(app.server)
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
