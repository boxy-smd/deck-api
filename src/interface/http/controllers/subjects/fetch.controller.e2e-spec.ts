import request from 'supertest'

import { app } from '@/app.ts'
import { Subject } from '@/domain/deck/enterprise/entities/subject.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'
import { makeSubject } from 'test/factories/make-subject.ts'

describe('fetch subjects controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch subjects', async () => {
    const subjectRepository = new PrismaSubjectsRepository()

    const ihc = makeSubject({
      name: 'Interação Humano-Computador I',
    })

    const de = makeSubject({
      name: 'Design Emocional',
    })

    await subjectRepository.create(ihc)
    await subjectRepository.create(de)

    const response = await request(app.server).get('/subjects')

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      subjects: [
        { id: de.id.toString(), name: de.name },
        { id: ihc.id.toString(), name: ihc.name },
      ],
    })
  })

  it('should be able to fetch subjects by name', async () => {
    const subjectRepository = new PrismaSubjectsRepository()

    const am = Subject.create({
      name: 'Autoração Multimídia I',
    })

    const pw = Subject.create({
      name: 'Programação Web',
    })

    await subjectRepository.create(am)
    await subjectRepository.create(pw)

    const response = await request(app.server).get('/subjects').query({
      name: 'Web',
    })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      subjects: [{ id: pw.id.toString(), name: pw.name }],
    })
  })
})
