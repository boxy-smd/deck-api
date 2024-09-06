import request from 'supertest'

import { app } from '@/app.ts'
import { Trail } from '@/domain/deck/enterprise/entities/trail.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'

describe('fetch trails controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch trails', async () => {
    const trailRepository = new PrismaTrailsRepository()
    const trail1 = Trail.create({
      name: 'Sistemas',
    })

    const trail2 = Trail.create({
      name: 'Design',
    })

    await trailRepository.create(trail1)
    await trailRepository.create(trail2)

    const response = await request(app.server).get('/trails')

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      trails: [
        { id: trail1.id.toString(), name: trail1.name },
        { id: trail2.id.toString(), name: trail2.name },
      ],
    })
  })
})
