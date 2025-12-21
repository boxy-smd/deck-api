import { makeProfessor } from 'test/factories/make-professor'
import { makeSubject } from 'test/factories/make-subject'
import { makeTrail } from 'test/factories/make-trail'
import { makeUser } from 'test/factories/make-user'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import type { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import type { Trail } from '@/@core/domain/projects/entities/trail'
import type { User } from '@/@core/domain/users/entities/user'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import type { ProfessorsRepository } from '../../professors/repositories/professors-repository'
import type { SubjectsRepository } from '../../subjects/repositories/subjects-repository'
import type { TrailsRepository } from '../../trails/repositories/trails-repository'
import type { ProjectsRepository } from '../repositories/projects-repository'
import { PublishProjectUseCase } from './publish-project'

let projectsRepository: ProjectsRepository
let usersRepository: UsersRepository
let subjectsRepository: SubjectsRepository
let trailsRepository: TrailsRepository
let professorsRepository: ProfessorsRepository

let author: User
let trail: Trail

let sut: PublishProjectUseCase

describe('publish project use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    professorsRepository = new InMemoryProfessorsRepository()

    projectsRepository = new InMemoryProjectsRepository(
      usersRepository,
      subjectsRepository,
      trailsRepository,
      professorsRepository,
    )

    author = await makeUser()
    trail = makeTrail()

    sut = new PublishProjectUseCase(
      projectsRepository,
      usersRepository,
      subjectsRepository,
      trailsRepository,
      professorsRepository,
    )
  })

  it('should be able to publish a project', async () => {
    await usersRepository.create(author)
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

    await usersRepository.create(author)
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

    await usersRepository.create(author)
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
    await usersRepository.create(author)

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
    await usersRepository.create(author)
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
