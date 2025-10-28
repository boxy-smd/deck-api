import request from 'supertest'

import { app } from '@/app.ts'
import { PrismaDraftsRepository } from '@/infra/database/prisma/repositories/drafts-repository.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'
import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students.ts'

describe('edit Project (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to edit a project', async () => {
    const { studentId, token } = await createAndAuthenticateStudent()

    const draftsRepository = new PrismaDraftsRepository()

    const draft = Project.create({
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
      message: 'Project updated successfully.',
    })
  })
})
