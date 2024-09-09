import request from 'supertest'

import { app } from '@/app.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { makeSubject } from 'test/factories/make-subject.ts'
import { makeTrail } from 'test/factories/make-trail.ts'

describe('comment on project (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to comment on project', async () => {
    const studentsRepository = new PrismaStudentsRepository()
    const trailsRepository = new PrismaTrailsRepository()
    const subjectsRepository = new PrismaSubjectsRepository()
    const projectsRepository = new PrismaProjectsRepository()

    const author = await makeStudent()
    const trail = makeTrail()
    const subject = makeSubject()
    const project = makeProject({
      authorId: author.id,
      subjectId: subject.id,
      trails: [trail],
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await subjectsRepository.create(subject)
    await projectsRepository.create(project)

    const result = await request(app.server)
      .post(`/projects/${project.id.toString()}/comments`)
      .send({
        content: 'This is a comment',
        authorId: author.id.toString(),
      })

    expect(result.status).toBe(201)
    expect(result.body).toEqual({
      commentId: expect.any(String),
    })
  })
})
