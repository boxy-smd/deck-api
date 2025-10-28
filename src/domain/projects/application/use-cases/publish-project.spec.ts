import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository.ts'
import type { User } from '@/domain/authentication/enterprise/entities/user.ts'
import type { ProfessorsRepository } from '@/domain/projects/application/repositories/professors-repository.ts'
import type { ProjectsRepository } from '@/domain/projects/application/repositories/projects-repository.ts'
import type { SubjectsRepository } from '@/domain/projects/application/repositories/subjects-repository.ts'
import type { TrailsRepository } from '@/domain/projects/application/repositories/trails-repository.ts'
import type { Trail } from '@/domain/projects/enterprise/entities/trail.ts'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error.ts'
import { makeProfessor } from 'test/factories/make-professor.ts'
import { makeSubject } from 'test/factories/make-subject.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { makeUser } from 'test/factories/make-user.ts'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import { InMemoryUsersRepository } from 'test/repositories/users-repository.ts'
import { PublishProjectUseCase } from './publish-project.ts'

let projectsRepository: ProjectsRepository
let studentsRepository: UsersRepository
let subjectsRepository: SubjectsRepository
let trailsRepository: TrailsRepository
let professorsRepository: ProfessorsRepository

let author: User
let trail: Trail

let sut: PublishProjectUseCase

describe('publish project use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryUsersRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    professorsRepository = new InMemoryProfessorsRepository()

    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      subjectsRepository,
      trailsRepository,
      professorsRepository,
    )

    author = await makeUser()
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
