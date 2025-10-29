import type { UsersRepository } from '@/@core/domain/authentication/application/repositories/users-repository'
import type { User } from '@/@core/domain/authentication/enterprise/entities/user'
import type { ProfessorsRepository } from '@/@core/domain/projects/application/repositories/professors-repository'
import type { ProjectsRepository } from '@/@core/domain/projects/application/repositories/projects-repository'
import type { SubjectsRepository } from '@/@core/domain/projects/application/repositories/subjects-repository'
import type { TrailsRepository } from '@/@core/domain/projects/application/repositories/trails-repository'
import type { Project } from '@/@core/domain/projects/enterprise/entities/project'
import type { Trail } from '@/@core/domain/projects/enterprise/entities/trail'
import { ForbiddenError } from '@/@shared/kernel/errors/forbidden.error'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { makeProject } from 'test/factories/make-project'
import { makeTrail } from 'test/factories/make-trail'
import { makeUser } from 'test/factories/make-user'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import { EditDraftUseCase } from './edit-draft'

let projectsRepository: ProjectsRepository
let studentsRepository: UsersRepository
let subjectsRepository: SubjectsRepository
let trailsRepository: TrailsRepository
let professorsRepository: ProfessorsRepository

let author: User
let trail: Trail
let draft: Project

let sut: EditDraftUseCase

describe('edit draft use case', () => {
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
    draft = makeProject({
      title: 'Draft Title',
      authorId: author.id,
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await projectsRepository.create(draft)

    sut = new EditDraftUseCase(
      projectsRepository,
      studentsRepository,
      subjectsRepository,
      trailsRepository,
      professorsRepository,
    )
  })

  it('should be able to edit a draft', async () => {
    const result = await sut.execute({
      authorId: author.id.toString(),
      draftId: draft.id.toString(),
      title: 'New Draft Title',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value.title).toBe('New Draft Title')
  })

  it('should not be able to edit a draft without being logged in', async () => {
    const result = await sut.execute({
      authorId: '',
      draftId: draft.id.toString(),
      title: 'New Draft Title',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(ForbiddenError)
  })

  it('should not be able to edit a draft that does not exist', async () => {
    const result = await sut.execute({
      authorId: author.id.toString(),
      draftId: 'invalid-id',
      title: 'New Draft Title',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      ResourceNotFoundError,
    )
  })

  it('should not be able to edit a draft from another author', async () => {
    const anotherAuthor = await makeUser()
    await studentsRepository.create(anotherAuthor)

    const result = await sut.execute({
      authorId: anotherAuthor.id.toString(),
      draftId: draft.id.toString(),
      title: 'New Draft Title',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(ForbiddenError)
  })
})
