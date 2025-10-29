import request from 'supertest'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'

import { Trail } from '@/@core/domain/projects/enterprise/entities/trail'
import { PrismaTrailsRepository } from '@/@infra/database/prisma/repositories/trails-repository'

describe('fetch trails controller (e2e)', () => {
  beforeAll(async () => {
    await createTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it('should be able to fetch trails', async () => {
    const app = await createTestApp()
    const trailRepository = new PrismaTrailsRepository()
    const trail1 = Trail.create({
      name: 'Sistemas',
    })

    const trail2 = Trail.create({
      name: 'Design',
    })

    await trailRepository.create(trail1)
    await trailRepository.create(trail2)

    const response = await request(app.getHttpServer()).get('/trails')

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      trails: [
        { id: trail1.id.toString(), name: trail1.name },
        { id: trail2.id.toString(), name: trail2.name },
      ],
    })
  })
})
