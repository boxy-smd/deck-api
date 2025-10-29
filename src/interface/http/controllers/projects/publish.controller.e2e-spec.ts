import request from 'supertest'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'

import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository'
import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students'
import { makeProfessor } from 'test/factories/make-professor'
import { makeSubject } from 'test/factories/make-subject'

describe('publish project (e2e)', () => {
  beforeAll(async () => {
    await createTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it('should be able to publish a project', async () => {
    const app = await createTestApp()
    const { token, trail } = await createAndAuthenticateStudent()

    const professorsRepository = new PrismaProfessorsRepository()
    const subjectsRepository = new PrismaSubjectsRepository()

    const professor = makeProfessor({
      name: 'Ticianne de Gois Ribeiro Darin',
    })

    const subject = makeSubject({
      name: 'Interação Humano-Computador I',
    })

    await professorsRepository.create(professor)
    await subjectsRepository.create(subject)

    const response = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Design de Interação',
        description: 'Projeto de Design de Interação',
        bannerUrl: 'https://example.com/banner.jpg',
        content: 'Conteúdo do projeto',
        publishedYear: 2021,
        semester: 3,
        allowComments: true,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      project_id: expect.any(String),
    })
  })
})
