import { makeProject } from 'test/factories/make-project'
import { makeTrail } from 'test/factories/make-trail'
import { makeUser } from 'test/factories/make-user'
import { InMemoryCommentsRepository } from 'test/repositories/comments-repository'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import type { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import type { Project } from '@/@core/domain/projects/entities/project'
import type { Trail } from '@/@core/domain/projects/entities/trail'
import type { User } from '@/@core/domain/users/entities/user'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { CommentsRepository } from '../../interactions/repositories/comments-repository'
import type { SubjectsRepository } from '../../subjects/repositories/subjects-repository'
import type { TrailsRepository } from '../../trails/repositories/trails-repository'
import type { ProjectsRepository } from '../repositories/projects-repository'
import { GetProjectUseCase } from './get-project'

let usersRepository: UsersRepository
let subjectsRepository: SubjectsRepository
let trailsRepository: TrailsRepository
let projectsRepository: ProjectsRepository
let commentsRepository: CommentsRepository

let author: User
let trail: Trail
let project: Project

let sut: GetProjectUseCase

describe('get project use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()

    projectsRepository = new InMemoryProjectsRepository(
      usersRepository,
      subjectsRepository,
      trailsRepository,
    )
    commentsRepository = new InMemoryCommentsRepository()

    author = await makeUser()

    trail = makeTrail()

    project = makeProject({
      authorId: author.id,
      trails: new Set([trail.id]),
    })

    await usersRepository.create(author)
    await trailsRepository.create(trail)

    sut = new GetProjectUseCase(projectsRepository, commentsRepository)
  })

  it('should be able to get a project', async () => {
    await projectsRepository.create(project)

    const result = await sut.execute({
      projectId: project.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        id: project.id.toString(),
        title: project.title,
        description: project.description,
      }),
    )
  })

  it('should not be able to get a non existing project', async () => {
    const result = await sut.execute({
      projectId: 'non-existing-project-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
