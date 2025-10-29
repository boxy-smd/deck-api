import request from 'supertest'

import { app } from '@/app'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository'
import { makeProject } from 'test/factories/make-project'
import { makeUser } from 'test/factories/make-user'
import { makeSubject } from 'test/factories/make-subject'
import { makeTrail } from 'test/factories/make-trail'

describe('get project (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a project', async () => {
    const projectsRepository = new PrismaProjectsRepository()
    const studentsRepository = new PrismaStudentsRepository(
      projectsRepository,
    )
    const trailsRepository = new PrismaTrailsRepository()
    const subjectsRepository = new PrismaSubjectsRepository()

    const author = await makeUser()
    const trail = makeTrail()
    const subject = makeSubject()
    const project = makeProject({
      authorId: author.id,
      subjectId: subject.id,
      trails: new Set([trail.id]),
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await subjectsRepository.create(subject)
    await projectsRepository.create(project)

    const result = await request(app.server).get(
      `/projects/${project.id.toString()}`,
    )

    expect(result.status).toBe(200)
    expect(result.body.project).toMatchObject({
      id: project.id.toString(),
      title: project.title,
      description: project.description,
      bannerUrl: project.bannerUrl,
      publishedYear: project.publishedYear,
      status: project.status,
      semester: project.semester,
      allowComments: project.allowComments,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      authorId: project.authorId.toString(),
      author: {
        name: author.name,
        username: author.username.value,
        profileUrl: author.profileUrl,
      },
      subjectId: project.subjectId?.toString(),
      subject: subject.name,
      professors: [],
      comments: [],
    })
    expect(result.body.project.trails).toContain(trail.name)
  })
})
