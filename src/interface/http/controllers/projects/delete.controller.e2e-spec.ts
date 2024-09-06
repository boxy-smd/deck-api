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

describe('delete project (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete a project', async () => {
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
      authorId: author.id,
      trails: [trail],
    })

    await trailsRepository.create(trail)
    await professorsRepository.create(professor)
    await subjectsRepository.create(subject)
    await studentsRepository.create(author)
    await projectsRepository.create(project)

    const response = await request(app.server).delete(`/projects/${project.id}`)

    expect(response.status).toBe(204)
  })
})
