import request from 'supertest'

import { app } from '@/app.ts'
import { Draft } from '@/domain/deck/enterprise/entities/draft.ts'
import { PrismaDraftsRepository } from '@/infra/database/prisma/repositories/drafts-repository.ts'
import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students.ts'

describe('get draft (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a draft', async () => {
    const { studentId, token } = await createAndAuthenticateStudent()

    const draftsRepository = new PrismaDraftsRepository()

    const draft = Draft.create({
      title: 'Design de Interação',
      authorId: studentId,
    })

    await draftsRepository.create(draft)

    const response = await request(app.server)
      .get(`/drafts/${draft.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      draft: {
        id: draft.id.toString(),
        title: 'Design de Interação',
        trailsIds: [],
      },
    })
  })
})
