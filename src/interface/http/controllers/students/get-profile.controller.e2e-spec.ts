import request from 'supertest'

import { app } from '@/app.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { makeStudent } from 'test/factories/make-student.ts'

describe('get profile controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get profile', async () => {
    const studentsRepository = new PrismaStudentsRepository()

    const student = await makeStudent()

    await studentsRepository.create(student)

    const response = await request(app.server).get(`/profile/${student.id}`)

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      profile: {
        id: student.id.toString(),
        name: student.name,
        username: student.username,
        about: student.about,
        semester: student.semester,
        profileUrl: student.profileUrl,
        trailsIds: student.trails.map(trail => trail.id.toString()),
      },
    })
  })
})
