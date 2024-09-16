import request from 'supertest'

import { app } from '@/app.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'
import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students.ts'
import { makeProfessor } from 'test/factories/make-professor.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeSubject } from 'test/factories/make-subject.ts'

describe('edit project (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to edit a project', async () => {
    const { studentId, token, trail } = await createAndAuthenticateStudent()

    const professorsRepository = new PrismaProfessorsRepository()
    const subjectsRepository = new PrismaSubjectsRepository()
    const projectsRepository = new PrismaProjectsRepository()

    const professor = makeProfessor({
      name: 'Ticianne de Gois Ribeiro Darin',
    })

    const subject = makeSubject({
      name: 'Interação Humano-Computador I',
    })

    const project = makeProject({
      title: 'Design de Interação',
      description: 'Projeto de Design de Interação',
      bannerUrl: 'https://example.com/banner.jpg',
      content: 'Conteúdo do projeto',
      publishedYear: 2021,
      status: 'DRAFT',
      semester: 3,
      authorId: new UniqueEntityID(studentId),
      allowComments: true,
      subjectId: subject.id,
      trails: [trail],
      professors: [professor],
    })

    await professorsRepository.create(professor)
    await subjectsRepository.create(subject)
    await projectsRepository.create(project)

    const response = await request(app.server)
      .put(`/projects/${project.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        subjectId: subject.id.toString(),
        status: 'PUBLISHED',
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      message: 'Project updated successfully',
    })
  })
})
