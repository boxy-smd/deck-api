import request from 'supertest'

import { app } from '@/app.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'
import { makeTrail } from 'test/factories/make-trail.ts'

describe('authenticate controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate a user', async () => {
    const trail = makeTrail()
    const trailsRepository = new PrismaTrailsRepository()

    await trailsRepository.create(trail)

    await request(app.server)
      .post('/students')
      .send({
        name: 'John Doe',
        username: 'johndoe',
        email: 'johndoe@alu.ufc.br',
        password: '123456',
        semester: 1,
        trailsIds: [trail.id.toString()],
      })

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@alu.ufc.br',
      password: '123456',
    })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      token: expect.any(String),
    })
  })
})
