import request from 'supertest'

import { app } from '@/app.ts'
import { PrismaDraftsRepository } from '@/infra/database/prisma/repositories/drafts-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { makeUser } from 'test/factories/make-user.ts'

describe('get profile controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get profile', async () => {
    const projectsRepository = new PrismaProjectsRepository()
    const draftsRepository = new PrismaDraftsRepository()
    const studentsRepository = new PrismaStudentsRepository(
      projectsRepository,
      draftsRepository,
    )

    const student = await makeUser()

    await studentsRepository.create(student)

    const response = await request(app.server).get(
      `/profiles/${student.username}`,
    )

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      profile: {
        id: student.id.toString(),
        name: student.name,
        username: student.username,
        about: student.about,
        semester: student.semester,
        profileUrl: student.profileUrl,
        trails: student.trails.map(trail => trail.name),
        posts: [],
      },
    })
  })
})
