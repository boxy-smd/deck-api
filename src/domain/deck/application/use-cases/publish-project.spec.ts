import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import { makeProfessor } from 'test/factories/make-professor.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { makeSubject } from 'test/factories/make-subject.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import { PublishProjectUseCase } from './publish-project.ts'

let projectsRepository: InMemoryProjectsRepository
let studentsRepository: InMemoryStudentsRepository
let subjectsRepository: InMemorySubjectsRepository
let trailsRepository: InMemoryTrailsRepository
let professorsRepository: InMemoryProfessorsRepository

let author: Student
let trail: Trail

let sut: PublishProjectUseCase

describe('publish project use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    professorsRepository = new InMemoryProfessorsRepository()

    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      subjectsRepository,
    )

    author = await makeStudent()
    trail = makeTrail()

    sut = new PublishProjectUseCase(
      projectsRepository,
      studentsRepository,
      subjectsRepository,
      trailsRepository,
      professorsRepository,
    )
  })

  it('should be able to publish a project', async () => {
    await studentsRepository.create(author)
    await trailsRepository.create(trail)

    const result = await sut.execute({
      title: 'Project Title',
      description: 'Project Description',
      bannerUrl: 'https://banner-url.com',
      publishedYear: 2021,
      status: 'DRAFT',
      semester: 1,
      allowComments: true,
      authorId: author.id.toString(),
      trailsIds: [trail.id.toString()],
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toMatchObject({
      projectId: expect.any(String),
    })
  })

  it('should be able to publish a project with a subject', async () => {
    const subject = makeSubject()

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await subjectsRepository.create(subject)

    const result = await sut.execute({
      title: 'Project Title',
      description: 'Project Description',
      bannerUrl: 'https://banner-url.com',
      publishedYear: 2021,
      status: 'DRAFT',
      semester: 1,
      allowComments: true,
      authorId: author.id.toString(),
      trailsIds: [trail.id.toString()],
      subjectId: subject.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toMatchObject({
      projectId: expect.any(String),
    })
  })

  it('should be able to publish a project with professors', async () => {
    const professor = makeProfessor()

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await professorsRepository.create(professor)

    const result = await sut.execute({
      title: 'Project Title',
      description: 'Project Description',
      bannerUrl: 'https://banner-url.com',
      publishedYear: 2021,
      status: 'DRAFT',
      semester: 1,
      allowComments: true,
      authorId: author.id.toString(),
      trailsIds: [trail.id.toString()],
      professorsIds: [professor.id.toString()],
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toMatchObject({
      projectId: expect.any(String),
    })
  })

  it('should not be able to publish a project with a non-existing student', async () => {
    await trailsRepository.create(trail)

    const result = await sut.execute({
      title: 'Project Title',
      description: 'Project Description',
      bannerUrl: 'https://banner-url.com',
      publishedYear: 2021,
      status: 'DRAFT',
      semester: 1,
      allowComments: true,
      authorId: 'non-existing-student-id',
      trailsIds: [trail.id.toString()],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      ResourceNotFoundError,
    )
  })

  it('should not be able to publish a project with a non-existing trail', async () => {
    await studentsRepository.create(author)

    const result = await sut.execute({
      title: 'Project Title',
      description: 'Project Description',
      bannerUrl: 'https://banner-url.com',
      publishedYear: 2021,
      status: 'DRAFT',
      semester: 1,
      allowComments: true,
      authorId: author.id.toString(),
      trailsIds: ['non-existing-trail-id'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      ResourceNotFoundError,
    )
  })

  it('should not be able to publish a project with a non-existing subject', async () => {
    await studentsRepository.create(author)
    await trailsRepository.create(trail)

    const result = await sut.execute({
      title: 'Project Title',
      description: 'Project Description',
      bannerUrl: 'https://banner-url.com',
      publishedYear: 2021,
      status: 'DRAFT',
      semester: 1,
      allowComments: true,
      authorId: author.id.toString(),
      trailsIds: [trail.id.toString()],
      subjectId: 'non-existing-subject-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})
