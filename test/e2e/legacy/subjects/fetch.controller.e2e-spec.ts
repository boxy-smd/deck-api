import request from 'supertest'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'

import { PrismaSubjectsRepository } from '@/@infra/database/prisma/repositories/subjects-repository'
import { makeSubject } from 'test/factories/make-subject'

describe('fetch subjects controller (e2e)', () => {
  beforeAll(async () => {
    await createTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it('should be able to fetch subjects', async () => {
    const app = await createTestApp()
    const subjectRepository = new PrismaSubjectsRepository()

    const ihc = makeSubject({
      code: 'SMD0108',
      name: 'Interação Humano-Computador I',
    })

    const de = makeSubject({
      code: 'SMD0130',
      name: 'Design Emocional',
    })

    await subjectRepository.create(ihc)
    await subjectRepository.create(de)

    const response = await request(app.getHttpServer()).get('/subjects')

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      subjects: [
        { id: de.id.toString(), name: de.name },
        { id: ihc.id.toString(), name: ihc.name },
      ],
    })
  })

  it('should be able to fetch subjects by name', async () => {
    const app = await createTestApp()
    const subjectRepository = new PrismaSubjectsRepository()

    const am = makeSubject({
      code: 'SMD0088',
      name: 'Autoração Multimídia I',
    })

    const pw = makeSubject({
      code: 'SMD0052',
      name: 'Programação para Web I',
    })

    await subjectRepository.create(am)
    await subjectRepository.create(pw)

    const response = await request(app.getHttpServer()).get('/subjects').query({
      name: 'Web',
    })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      subjects: [{ id: pw.id.toString(), name: pw.name }],
    })
  })
})
