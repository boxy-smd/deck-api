import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository'
import type { User } from '@/domain/authentication/enterprise/entities/user'
import { makeProject } from 'test/factories/make-project'
import { makeTrail } from 'test/factories/make-trail'
import { makeUser } from 'test/factories/make-user'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import type { Project } from '../../../projects/enterprise/entities/project'
import type { Trail } from '../../enterprise/entities/trail'
import type { ProjectsRepository } from '../repositories/projects-repository'
import type { TrailsRepository } from '../repositories/trails-repository'
import { SearchPostsByTitleUseCase } from './search-posts-by-title'

let projectsRepository: ProjectsRepository
let studentsRepository: UsersRepository
let trailsRepository: TrailsRepository

let author: User
let trail: Trail
let project: Project

let sut: SearchPostsByTitleUseCase

describe('search posts by title use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryUsersRepository()
    trailsRepository = new InMemoryTrailsRepository()

    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      undefined,
      trailsRepository,
      undefined,
    )

    author = await makeUser()

    trail = makeTrail()

    project = makeProject({
      title: 'Awesome project',
      authorId: author.id,
      trails: new Set([trail.id]),
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await projectsRepository.create(project)

    sut = new SearchPostsByTitleUseCase(projectsRepository)
  })

  it('should be able to search posts by title', async () => {
    const result = await sut.execute({
      title: 'Awesome',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should be able to search posts by title case insensitive', async () => {
    const result = await sut.execute({
      title: 'awesome',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should be able to search posts by title with partial match', async () => {
    const result = await sut.execute({
      title: 'some',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should not return any post when title does not match', async () => {
    const result = await sut.execute({
      title: 'Not found',
    })

    expect(result).length(0)
  })
})
