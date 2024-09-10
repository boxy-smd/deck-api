import request from 'supertest'

import { app } from '@/app.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'
import { makeTrail } from 'test/factories/make-trail.ts'

describe('register controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a user', async () => {
    const trail = makeTrail()
    const trailsRepository = new PrismaTrailsRepository()

    await trailsRepository.create(trail)

    const response = await request(app.server)
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
