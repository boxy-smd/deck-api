import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository.ts'
import type { User } from '@/domain/authentication/enterprise/entities/user.ts'
import type { ProfessorsRepository } from '@/domain/projects/application/repositories/professors-repository.ts'
import type { ProjectsRepository } from '@/domain/projects/application/repositories/projects-repository.ts'
import type { SubjectsRepository } from '@/domain/projects/application/repositories/subjects-repository.ts'
import type { TrailsRepository } from '@/domain/projects/application/repositories/trails-repository.ts'
import type { Project } from '@/domain/projects/enterprise/entities/project.ts'
import type { Trail } from '@/domain/projects/enterprise/entities/trail.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { makeUser } from 'test/factories/make-user.ts'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import { InMemoryUsersRepository } from 'test/repositories/users-repository.ts'
import { EditDraftUseCase } from './edit-draft.ts'

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
