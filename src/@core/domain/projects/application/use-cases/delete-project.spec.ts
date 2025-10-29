import type { UsersRepository } from '@/@core/domain/authentication/application/repositories/users-repository'
import type { User } from '@/@core/domain/authentication/enterprise/entities/user'
import { ForbiddenError } from '@/@shared/kernel/errors/forbidden.error'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { makeProject } from 'test/factories/make-project'
import { makeTrail } from 'test/factories/make-trail'
import { makeUser } from 'test/factories/make-user'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import type { Project } from '../../enterprise/entities/project'
import type { Trail } from '../../enterprise/entities/trail'
import type { ProjectsRepository } from '../repositories/projects-repository'
import type { TrailsRepository } from '../repositories/trails-repository'
import { DeleteProjectUseCase } from './delete-project'

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
    expect(await projectsRepository.findById(project.id.toString())).toBe(null)
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
