import request from 'supertest'

import { app } from '@/app.ts'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'
import { makeProfessor } from 'test/factories/make-professor.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { makeSubject } from 'test/factories/make-subject.ts'
import { makeTrail } from 'test/factories/make-trail.ts'

describe('edit project (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to edit a project', async () => {
    const trailsRepository = new PrismaTrailsRepository()
    const professorsRepository = new PrismaProfessorsRepository()
    const subjectsRepository = new PrismaSubjectsRepository()
    const studentsRepository = new PrismaStudentsRepository()
    const projectsRepository = new PrismaProjectsRepository()

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

    const project = makeProject({
      title: 'Design de Interação',
      description: 'Projeto de Design de Interação',
      bannerUrl: 'https://example.com/banner.jpg',
      content: 'Conteúdo do projeto',
      publishedYear: 2021,
      status: 'DRAFT',
      semester: 3,
      allowComments: true,
      authorId: author.id,
      subjectId: subject.id,
      trails: [trail],
      professors: [professor],
    })

    await trailsRepository.create(trail)
    await professorsRepository.create(professor)
    await subjectsRepository.create(subject)
    await studentsRepository.create(author)
    await projectsRepository.create(project)

    const response = await request(app.server)
      .put(`/projects/${project.id}`)
      .send({
        authorId: author.id.toString(),
        subjectId: subject.id.toString(),
        status: 'PUBLISHED',
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      message: 'Project updated successfully',
    })
  })
})
