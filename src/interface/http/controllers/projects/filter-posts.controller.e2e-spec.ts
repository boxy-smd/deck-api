import request from 'supertest'

import { app } from '@/app.ts'
import type { Student } from '@/domain/authentication/enterprise/entities/student.ts'
import type { Professor } from '@/domain/deck/enterprise/entities/professor.ts'
import type { Subject } from '@/domain/deck/enterprise/entities/subject.ts'
import type { Trail } from '@/domain/deck/enterprise/entities/trail.ts'
import type { Project } from '@/domain/projects/enterprise/entities/project.ts'
import { PrismaDraftsRepository } from '@/infra/database/prisma/repositories/drafts-repository.ts'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'
import { makeProfessor } from 'test/factories/make-professor.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeUser } from 'test/factories/make-user.ts'
import { makeSubject } from 'test/factories/make-subject.ts'
import { makeTrail } from 'test/factories/make-trail.ts'

let author: Student
let subject: Subject
let trail: Trail
let professor: Professor
let project: Project

describe('filter posts (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    const projectsRepository = new PrismaProjectsRepository()
    const draftsRepository = new PrismaDraftsRepository()
    const studentsRepository = new PrismaStudentsRepository(
      projectsRepository,
      draftsRepository,
    )
    const trailsRepository = new PrismaTrailsRepository()
    const professorsRepository = new PrismaProfessorsRepository()
    const subjectsRepository = new PrismaSubjectsRepository()

    author = await makeUser()
    trail = makeTrail()
    subject = makeSubject()
    professor = makeProfessor()
    project = makeProject({
      status: 'PUBLISHED',
      authorId: author.id,
      subjectId: subject.id,
      professors: [professor],
      trails: [trail],
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await subjectsRepository.create(subject)
    await professorsRepository.create(professor)
    await projectsRepository.create(project)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to filter posts by published year', async () => {
    const result = await request(app.server).get('/projects/filter').query({
      publishedYear: project.publishedYear,
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })

  it('should be able to filter posts by semester', async () => {
    const result = await request(app.server).get('/projects/filter').query({
      semester: project.semester,
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })

  it('should be able to filter posts by subject id', async () => {
    const result = await request(app.server).get('/projects/filter').query({
      subjectId: subject.id.toString(),
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })

  it('should be able to filter posts by trail id', async () => {
    const result = await request(app.server).get('/projects/filter').query({
      trailsIds: trail.id.toString(),
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })
})
