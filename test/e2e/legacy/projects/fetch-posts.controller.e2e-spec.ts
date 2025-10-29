import request from 'supertest'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'

import { ProjectStatus } from '@/@core/domain/projects/enterprise/value-objects/project-status'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'
import { PrismaStudentsRepository } from '@/@infra/database/prisma/repositories/students-repository'
import { PrismaSubjectsRepository } from '@/@infra/database/prisma/repositories/subjects-repository'
import { PrismaTrailsRepository } from '@/@infra/database/prisma/repositories/trails-repository'
import { makeProject } from 'test/factories/make-project'
import { makeSubject } from 'test/factories/make-subject'
import { makeTrail } from 'test/factories/make-trail'
import { makeUser } from 'test/factories/make-user'

describe('fetch posts (e2e)', () => {
  beforeAll(async () => {
    await createTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it('should be able to fetch posts', async () => {
    const app = await createTestApp()
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
      status: ProjectStatus.PUBLISHED,
      authorId: author.id,
      subjectId: subject.id,
      trails: new Set([trail.id]),
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await subjectsRepository.create(subject)
    await projectsRepository.create(project)

    const result = await request(app.getHttpServer()).get('/projects')

    expect(result.status).toBe(200)
    expect(result.body).toEqual({
      posts: [
        {
          id: project.id.toString(),
          title: project.title,
          description: project.description,
          bannerUrl: project.bannerUrl,
          content: project.content,
          publishedYear: project.publishedYear,
          status: project.status,
          semester: project.semester,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          authorId: project.authorId.toString(),
          author: {
            name: author.name,
            username: author.username.value,
            profileUrl: author.profileUrl,
          },
          subjectId: project.subjectId?.toString(),
          subject: {
            name: subject.name,
          },
          trails: [
            {
              name: trail.name,
            },
          ],
          professors: [],
        },
      ],
    })
  })
})
