import request from 'supertest'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'

import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository'
import { makeProfessor } from 'test/factories/make-professor'

describe('fetch professors controller (e2e)', () => {
  beforeAll(async () => {
    await createTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it('should be able to fetch professors', async () => {
    const app = await createTestApp()
    const professorRepository = new PrismaProfessorsRepository()

    const tici = makeProfessor({
      name: 'Ticianne Darin',
    })

    const inga = makeProfessor({
      name: 'Inga Saboia',
    })

    await professorRepository.create(tici)
    await professorRepository.create(inga)

    const response = await request(app.getHttpServer()).get('/professors')

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      professors: [
        { id: inga.id.toString(), name: inga.name },
        { id: tici.id.toString(), name: tici.name },
      ],
    })
  })

  it('should be able to fetch professors by name', async () => {
    const app = await createTestApp()
    const professorRepository = new PrismaProfessorsRepository()

    const pequeno = makeProfessor({
      name: 'Henrique Pequeno',
    })

    const mara = makeProfessor({
      name: 'Mara Bonates',
    })

    await professorRepository.create(pequeno)
    await professorRepository.create(mara)

    const response = await request(app.getHttpServer()).get('/professors').query({
      name: 'Pequeno',
    })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      professors: [{ id: pequeno.id.toString(), name: pequeno.name }],
    })
  })
})
