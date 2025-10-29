import request from 'supertest'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'

import { PrismaTrailsRepository } from '@/@infra/database/prisma/repositories/trails-repository'
import { makeTrail } from 'test/factories/make-trail'

describe('authenticate controller (e2e)', () => {
  beforeAll(async () => {
    await createTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it('should be able to authenticate a user', async () => {
    const app = await createTestApp()
    const trail = makeTrail()
    const trailsRepository = new PrismaTrailsRepository()

    await trailsRepository.create(trail)

    await request(app.getHttpServer())
      .post('/students')
      .send({
        name: 'John Doe',
        username: 'johndoe',
        email: 'johndoe@alu.ufc.br',
        password: '123456',
        semester: 1,
        trailsIds: [trail.id.toString()],
      })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@alu.ufc.br',
      password: '123456',
    })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      token: expect.any(String),
    })
  })
})
