import request from 'supertest'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'

import type { User } from '@/@core/domain/authentication/enterprise/entities/user'
import type { Professor } from '@/@core/domain/projects/enterprise/entities/professor'
import type { Project } from '@/@core/domain/projects/enterprise/entities/project'
import type { Subject } from '@/@core/domain/projects/enterprise/entities/subject'
import type { Trail } from '@/@core/domain/projects/enterprise/entities/trail'
import { ProjectStatus } from '@/@core/domain/projects/enterprise/value-objects/project-status'
import { PrismaProfessorsRepository } from '@/@infra/database/prisma/repositories/professors-repository'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'
import { PrismaStudentsRepository } from '@/@infra/database/prisma/repositories/students-repository'
import { PrismaSubjectsRepository } from '@/@infra/database/prisma/repositories/subjects-repository'
import { PrismaTrailsRepository } from '@/@infra/database/prisma/repositories/trails-repository'
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

describe('search posts (e2e)', () => {
  beforeAll(async () => {
    await createTestApp()

    const projectsRepository = new PrismaProjectsRepository()
    const studentsRepository = new PrismaStudentsRepository(
      projectsRepository,
    )
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
    await closeTestApp()
  })

  it('should be able to search posts by title', async () => {
    const app = await createTestApp()
    const result = await request(app.getHttpServer()).get('/projects/search').query({
      title: project.title,
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })

  it('should be able to search posts by professor name', async () => {
    const app = await createTestApp()
    const result = await request(app.getHttpServer()).get('/projects/search').query({
      professorName: professor.name,
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })

  it('should be able to search posts by subject name', async () => {
    const app = await createTestApp()
    const result = await request(app.getHttpServer()).get('/projects/search').query({
      tag: subject.name.toLowerCase(),
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })

  it('should be able to search posts by trail name', async () => {
    const app = await createTestApp()
    const result = await request(app.getHttpServer()).get('/projects/search').query({
      tag: trail.name.toLowerCase(),
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })

  it('should be able to search posts by publish year', async () => {
    const app = await createTestApp()
    const result = await request(app.getHttpServer()).get('/projects/search').query({
      tag: project.publishedYear,
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })

  it('should be able to search posts by semester (unit)', async () => {
    const app = await createTestApp()
    const result = await request(app.getHttpServer()).get('/projects/search').query({
      tag: project.semester,
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })

  it('should be able to search posts by semester (ordinal)', async () => {
    const app = await createTestApp()
    const result = await request(app.getHttpServer()).get('/projects/search').query({
      tag: project.semester,
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })

  it('should be able to search posts by semester (word)', async () => {
    const app = await createTestApp()
    const result = await request(app.getHttpServer()).get('/projects/search').query({
      tag: 'primeiro',
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })
})
