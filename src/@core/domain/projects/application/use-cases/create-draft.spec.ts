import type { UsersRepository } from '@/@core/domain/authentication/application/repositories/users-repository'
import type { User } from '@/@core/domain/authentication/enterprise/entities/user'
import { ForbiddenError } from '@/@shared/kernel/errors/forbidden.error'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { makeTrail } from 'test/factories/make-trail'
import { makeUser } from 'test/factories/make-user'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import type { Trail } from '../../enterprise/entities/trail'
import type { ProfessorsRepository } from '../repositories/professors-repository'
import type { ProjectsRepository } from '../repositories/projects-repository'
import type { SubjectsRepository } from '../repositories/subjects-repository'
import type { TrailsRepository } from '../repositories/trails-repository'
import { CreateDraftUseCase } from './create-draft'

let projectsRepository: ProjectsRepository
let usersRepository: UsersRepository
let subjectsRepository: SubjectsRepository
let trailsRepository: TrailsRepository
let professorsRepository: ProfessorsRepository

let author: User
let trail: Trail

let sut: CreateDraftUseCase

describe('create draft use case', () => {
  beforeEach(async () => {
    projectsRepository = new InMemoryProjectsRepository()
    usersRepository = new InMemoryUsersRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    professorsRepository = new InMemoryProfessorsRepository()

    author = await makeUser()
    trail = makeTrail()

    sut = new CreateDraftUseCase(
      projectsRepository,
      usersRepository,
      subjectsRepository,
      trailsRepository,
      professorsRepository,
    )
  })

  it('should be able to create a draft', async () => {
    await usersRepository.create(author)
    await trailsRepository.create(trail)

    const result = await sut.execute({
      title: 'Título do rascunho',
      authorId: author.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      draftId: expect.any(String),
    })
  })

  it('should not be able to create a draft without a title', async () => {
    await usersRepository.create(author)

    const result = await sut.execute({
      title: '',
      authorId: author.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ForbiddenError)
  })

  it('should not be able to create a draft with an invalid author', async () => {
    await trailsRepository.create(trail)

    const result = await sut.execute({
      title: 'Título do rascunho',
      authorId: 'invalid-author-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a draft with an invalid trail', async () => {
    await usersRepository.create(author)

    const result = await sut.execute({
      title: 'Título do rascunho',
      authorId: author.id.toString(),
      trailsIds: ['invalid-trail-id'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
