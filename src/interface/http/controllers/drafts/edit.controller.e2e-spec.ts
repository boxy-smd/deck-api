import request from 'supertest'

import { app } from '@/app.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { Draft } from '@/domain/deck/enterprise/entities/draft.ts'
import { PrismaDraftsRepository } from '@/infra/database/prisma/repositories/drafts-repository.ts'
import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students.ts'

describe('edit draft (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to edit a project', async () => {
    const { studentId, token } = await createAndAuthenticateStudent()

    const draftsRepository = new PrismaDraftsRepository()

    const draft = Draft.create({
      title: 'Design de Interação',
      authorId: new UniqueEntityID(studentId),
    })

    await draftsRepository.create(draft)

    const response = await request(app.server)
      .put(`/drafts/${draft.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Design de Interação',
        description: 'Projeto de Design de Interação',
        bannerUrl: 'https://example.com/banner.jpg',
        content: 'Conteúdo do projeto',
        publishedYear: 2022,
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      message: 'Draft updated successfully.',
    })
  })
})
