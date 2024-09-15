import request from 'supertest'

import { app } from '@/app.ts'
import type { Professor } from '@/domain/deck/enterprise/entities/professor.ts'
import type { Project } from '@/domain/deck/enterprise/entities/project.ts'
import type { Student } from '@/domain/deck/enterprise/entities/student.ts'
import type { Subject } from '@/domain/deck/enterprise/entities/subject.ts'
import type { Trail } from '@/domain/deck/enterprise/entities/trail.ts'
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

let author: Student
let subject: Subject
let trail: Trail
let professor: Professor
let project: Project

describe('search posts (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    const projectsRepository = new PrismaProjectsRepository()
    const studentsRepository = new PrismaStudentsRepository(projectsRepository)
    const trailsRepository = new PrismaTrailsRepository()
    const professorsRepository = new PrismaProfessorsRepository()
    const subjectsRepository = new PrismaSubjectsRepository()

    author = await makeStudent()
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

  it('should be able to search posts by title', async () => {
    const result = await request(app.server).get('/projects/search').query({
      title: project.title,
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })

  it('should be able to search posts by professor name', async () => {
    const result = await request(app.server).get('/projects/search').query({
      professorName: professor.name,
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })

  it('should be able to search posts by subject name', async () => {
    const result = await request(app.server).get('/projects/search').query({
      tag: subject.name.toLowerCase(),
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })

  it('should be able to search posts by trail name', async () => {
    const result = await request(app.server).get('/projects/search').query({
      tag: trail.name.toLowerCase(),
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })

  it('should be able to search posts by publish year', async () => {
    const result = await request(app.server).get('/projects/search').query({
      tag: project.publishedYear,
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })

  it('should be able to search posts by semester (unit)', async () => {
    const result = await request(app.server).get('/projects/search').query({
      tag: project.semester,
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })

  it('should be able to search posts by semester (ordinal)', async () => {
    const result = await request(app.server).get('/projects/search').query({
      tag: project.semester,
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })

  it('should be able to search posts by semester (word)', async () => {
    const result = await request(app.server).get('/projects/search').query({
      tag: 'primeiro',
    })

    expect(result.status).toBe(200)
    expect(result.body.posts).length(1)
  })
})
