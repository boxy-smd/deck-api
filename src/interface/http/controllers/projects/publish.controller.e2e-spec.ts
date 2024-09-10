import request from 'supertest'

import { app } from '@/app.ts'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'
import { makeProfessor } from 'test/factories/make-professor.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { makeSubject } from 'test/factories/make-subject.ts'
import { makeTrail } from 'test/factories/make-trail.ts'

describe('publish project (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to publish a project', async () => {
    const trailsRepository = new PrismaTrailsRepository()
    const professorsRepository = new PrismaProfessorsRepository()
    const subjectsRepository = new PrismaSubjectsRepository()
    const studentsRepository = new PrismaStudentsRepository()

    const trail = makeTrail({
      name: 'Design',
    })

    const professor = makeProfessor({
      name: 'Ticianne de Gois Ribeiro Darin',
    })

    const subject = makeSubject({
      name: 'Interação Humano-Computador I',
    })

    const author = await makeStudent()

    await trailsRepository.create(trail)
    await professorsRepository.create(professor)
    await subjectsRepository.create(subject)
    await studentsRepository.create(author)

    const response = await request(app.server)
      .post('/projects')
      .send({
        title: 'Design de Interação',
        description: 'Projeto de Design de Interação',
        bannerUrl: 'https://example.com/banner.jpg',
        content: 'Conteúdo do projeto',
        publishedYear: 2021,
        status: 'PUBLISHED',
        semester: 3,
        allowComments: true,
        authorId: author.id.toString(),
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      message: 'Project published successfully.',
    })
  })
})
