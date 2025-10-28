import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository.ts'
import type { User } from '@/domain/authentication/enterprise/entities/user.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { makeUser } from 'test/factories/make-user.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import { InMemoryUsersRepository } from 'test/repositories/users-repository.ts'
import type { Project } from '../../enterprise/entities/project.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'
import type { TrailsRepository } from '../repositories/trails-repository.ts'
import { DeleteProjectUseCase } from './delete-project.ts'

let usersRepository: UsersRepository
let projectsRepository: ProjectsRepository
let trailsRepository: TrailsRepository

let author: User
let trail: Trail
let project: Project

let sut: DeleteProjectUseCase

describe('delete project use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    trailsRepository = new InMemoryTrailsRepository()
    projectsRepository = new InMemoryProjectsRepository()

    author = await makeUser()
    trail = makeTrail()
    project = makeProject({
      authorId: author.id,
      trails: new Set([trail.id]),
    })

    await usersRepository.save(author)
    await projectsRepository.save(project)
    await trailsRepository.save(trail)

    sut = new DeleteProjectUseCase(projectsRepository)
  })

  it('should be able to delete a project', async () => {
    const response = await sut.execute({
      studentId: author.id.toString(),
      projectId: project.id.toString(),
    })

    expect(response.isRight()).toBe(true)
    expect(await projectsRepository.findById(project.id)).toBe(null)
  })

  it('should not be able to delete a project that does not exist', async () => {
    const response = await sut.execute({
      studentId: author.id.toString(),
      projectId: 'invalid-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a project that does not belong to the student', async () => {
    const otherAuthor = await makeUser()
    await usersRepository.save(otherAuthor)

    const response = await sut.execute({
      studentId: otherAuthor.id.toString(),
      projectId: project.id.toString(),
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ForbiddenError)
  })
})
