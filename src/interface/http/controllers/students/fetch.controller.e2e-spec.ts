import request from 'supertest'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'

import { Email } from '@/domain/authentication/enterprise/value-objects/email'
import { Username } from '@/domain/authentication/enterprise/value-objects/username'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository'
import { makeUser } from 'test/factories/make-user'

describe('fetch students controller (e2e)', () => {
  beforeAll(async () => {
    await createTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it('should be able to fetch students', async () => {
    const app = await createTestApp()
    const studentsRepository = new PrismaStudentsRepository()

    const student = await makeUser()

    await studentsRepository.create(student)

    const response = await request(app.getHttpServer()).get('/students')

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      students: [
        {
          id: student.id.toString(),
          name: student.name,
          username: student.username.value,
          semester: student.profile?.semester.value,
          profileUrl: student.profileUrl,
          trails: [],
        },
      ],
    })
  })

  it('should be able to fetch students by name', async () => {
    const app = await createTestApp()
    const studentsRepository = new PrismaStudentsRepository()

    const amandaUsername = Username.create('amanda.coelho')
    if (amandaUsername.isLeft()) throw amandaUsername.value
    const amanda = await makeUser({
      name: 'Amanda Coelho',
      username: amandaUsername.value,
      email: Email.create('amanda@alu.ufc.br'),
    })

    const leviUsername = Username.create('levi.brito')
    if (leviUsername.isLeft()) throw leviUsername.value
    const levi = await makeUser({
      name: 'Levi de Brito',
      username: leviUsername.value,
      email: Email.create('levi@alu.ufc.br'),
    })

    await studentsRepository.create(amanda)
    await studentsRepository.create(levi)

    const response = await request(app.getHttpServer()).get('/students').query({
      name: 'Amanda',
    })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      students: [
        {
          id: amanda.id.toString(),
          name: amanda.name,
          username: amanda.username.value,
          semester: amanda.profile?.semester.value,
          profileUrl: amanda.profileUrl,
          trails: [],
        },
      ],
    })
  })
})
