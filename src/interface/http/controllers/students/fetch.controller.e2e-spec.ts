import request from 'supertest'

import { app } from '@/app.ts'
import { Email } from '@/domain/deck/enterprise/entities/value-objects/email.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { makeStudent } from 'test/factories/make-student.ts'

describe('fetch students controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch students', async () => {
    const studentsRepository = new PrismaStudentsRepository()

    const student = await makeStudent()

    await studentsRepository.create(student)

    const response = await request(app.server).get('/students')

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      students: [
        {
          id: student.id.toString(),
          name: student.name,
          username: student.username,
          semester: student.semester,
          profileUrl: student.profileUrl,
          trailsIds: student.trails.map(trail => trail.id.toString()),
        },
      ],
    })
  })

  it('should be able to fetch students by name', async () => {
    const studentsRepository = new PrismaStudentsRepository()

    const amanda = await makeStudent({
      name: 'Amanda Coelho',
      username: 'amanda.coelho',
      email: Email.create('amanda@alu.ufc.br'),
    })

    const levi = await makeStudent({
      name: 'Levi de Brito',
      username: 'levi.brito',
      email: Email.create('levi@alu.ufc.br'),
    })

    await studentsRepository.create(amanda)
    await studentsRepository.create(levi)

    const response = await request(app.server).get('/students').query({
      name: 'Amanda',
    })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      students: [
        {
          id: amanda.id.toString(),
          name: amanda.name,
          username: amanda.username,
          semester: amanda.semester,
          profileUrl: amanda.profileUrl,
          trailsIds: amanda.trails.map(trail => trail.id.toString()),
        },
      ],
    })
  })
})
