import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository.ts'
import type { User } from '@/domain/authentication/enterprise/entities/user.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { makeUser } from 'test/factories/make-user.ts'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import { InMemoryUsersRepository } from 'test/repositories/users-repository.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import type { ProfessorsRepository } from '../repositories/professors-repository.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'
import type { SubjectsRepository } from '../repositories/subjects-repository.ts'
import type { TrailsRepository } from '../repositories/trails-repository.ts'
import { CreateDraftUseCase } from './create-draft.ts'

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
