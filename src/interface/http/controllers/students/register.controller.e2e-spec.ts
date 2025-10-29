import request from 'supertest'

import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository'
import { makeTrail } from 'test/factories/make-trail'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'

describe('register controller (e2e)', () => {
  beforeAll(async () => {
    await createTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it('should be able to register a user', async () => {
    const app = await createTestApp()
    const trail = makeTrail()
    const trailsRepository = new PrismaTrailsRepository()

    await trailsRepository.create(trail)

    const response = await request(app.getHttpServer())
      .post('/students')
      .send({
        name: 'John Doe',
        username: 'johndoe',
        email: 'johndoe@alu.ufc.br',
        password: '123456',
        semester: 1,
        trailsIds: [trail.id.toString()],
      })

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({
      user_id: expect.any(String),
    })
  })
})
