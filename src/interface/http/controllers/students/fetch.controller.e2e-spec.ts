import request from 'supertest'

import { app } from '@/app.ts'
import { Email } from '@/domain/authentication/enterprise/value-objects/email.ts'
import { PrismaDraftsRepository } from '@/infra/database/prisma/repositories/drafts-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { makeUser } from 'test/factories/make-user.ts'

describe('fetch students controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch students', async () => {
    const projectsRepository = new PrismaProjectsRepository()
    const draftsRepository = new PrismaDraftsRepository()
    const studentsRepository = new PrismaStudentsRepository(
      projectsRepository,
      draftsRepository,
    )

    const student = await makeUser()

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
          trails: student.trails.map(trail => trail.name),
        },
      ],
    })
  })

  it('should be able to fetch students by name', async () => {
    const projectsRepository = new PrismaProjectsRepository()
    const draftsRepository = new PrismaDraftsRepository()
    const studentsRepository = new PrismaStudentsRepository(
      projectsRepository,
      draftsRepository,
    )

    const amanda = await makeUser({
      name: 'Amanda Coelho',
      username: 'amanda.coelho',
      email: Email.create('amanda@alu.ufc.br'),
    })

    const levi = await makeUser({
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
          trails: amanda.trails.map(trail => trail.name),
        },
      ],
    })
  })
})
