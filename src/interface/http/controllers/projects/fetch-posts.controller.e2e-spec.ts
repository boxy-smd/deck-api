import request from 'supertest'

import { app } from '@/app.ts'
import { PrismaDraftsRepository } from '@/infra/database/prisma/repositories/drafts-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { makeSubject } from 'test/factories/make-subject.ts'
import { makeTrail } from 'test/factories/make-trail.ts'

describe('fetch posts (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch posts', async () => {
    const projectsRepository = new PrismaProjectsRepository()
    const draftsRepository = new PrismaDraftsRepository()
    const studentsRepository = new PrismaStudentsRepository(
      projectsRepository,
      draftsRepository,
    )
    const trailsRepository = new PrismaTrailsRepository()
    const subjectsRepository = new PrismaSubjectsRepository()

    const author = await makeStudent()
    const trail = makeTrail()
    const subject = makeSubject()
    const project = makeProject({
      status: 'PUBLISHED',
      authorId: author.id,
      subjectId: subject.id,
      trails: [trail],
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await subjectsRepository.create(subject)
    await projectsRepository.create(project)

    const result = await request(app.server).get('/projects')

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
          createdAt: project.createdAt.toJSON(),
          updatedAt: expect.any(String),
          authorId: project.authorId.toString(),
          author: {
            name: author.name,
            username: author.username,
            profileUrl: author.profileUrl,
          },
          subjectId: project.subjectId?.toString(),
          subject: subject.name,
          trails: project.trails.map(trail => trail.name),
          professors: [],
        },
      ],
    })
  })
})
