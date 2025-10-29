import request from 'supertest'

import { app } from '@/app'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository'
import { makeUser } from 'test/factories/make-user'

describe('get profile controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get profile', async () => {
    const studentsRepository = new PrismaStudentsRepository()

    const student = await makeUser()

    await studentsRepository.create(student)

    const response = await request(app.server).get(
      `/profiles/${student.username.value}`,
    )

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      profile: {
        id: student.id.toString(),
        name: student.name,
        username: student.username.value,
        about: student.about,
        semester: student.profile?.semester.value,
        profileUrl: student.profileUrl,
        trails: [],
        posts: [],
      },
    })
  })
})
