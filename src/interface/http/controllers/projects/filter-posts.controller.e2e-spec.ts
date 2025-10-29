import request from 'supertest'

import { app } from '@/app'
import type { User } from '@/domain/authentication/enterprise/entities/user'
import type { Professor } from '@/domain/projects/enterprise/entities/professor'
import type { Project } from '@/domain/projects/enterprise/entities/project'
import type { Subject } from '@/domain/projects/enterprise/entities/subject'
import type { Trail } from '@/domain/projects/enterprise/entities/trail'
import { ProjectStatus } from '@/domain/projects/enterprise/value-objects/project-status'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository'
import { makeProfessor } from 'test/factories/make-professor'
import { makeProject } from 'test/factories/make-project'
import { makeSubject } from 'test/factories/make-subject'
import { makeTrail } from 'test/factories/make-trail'
import { makeUser } from 'test/factories/make-user'

let author: User
let subject: Subject
let trail: Trail
let professor: Professor
let project: Project

describe('filter posts (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    const projectsRepository = new PrismaProjectsRepository()
    const studentsRepository = new PrismaStudentsRepository()
    const trailsRepository = new PrismaTrailsRepository()
    const professorsRepository = new PrismaProfessorsRepository()
    const subjectsRepository = new PrismaSubjectsRepository()

    author = await makeUser()
    trail = makeTrail()
    subject = makeSubject()
    professor = makeProfessor()
    project = makeProject({
      status: ProjectStatus.PUBLISHED,
      authorId: author.id,
      subjectId: subject.id,
      professors: new Set([professor.id]),
      trails: new Set([trail.id]),
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
