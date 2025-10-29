import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository'
import type { User } from '@/domain/authentication/enterprise/entities/user'
import { makeProject } from 'test/factories/make-project'
import { makeTrail } from 'test/factories/make-trail'
import { makeUser } from 'test/factories/make-user'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import type { Project } from '../../enterprise/entities/project'
import type { Trail } from '../../enterprise/entities/trail'
import type { ProjectsRepository } from '../repositories/projects-repository'
import type { SubjectsRepository } from '../repositories/subjects-repository'
import type { TrailsRepository } from '../repositories/trails-repository'
import { FetchPostsUseCase } from './fetch-posts'

let projectsRepository: ProjectsRepository
let studentsRepository: UsersRepository
let subjectsRepository: SubjectsRepository
let trailsRepository: TrailsRepository

let author: User
let trail: Trail
let project: Project

let sut: FetchPostsUseCase

describe('fetch posts use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryUsersRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()

    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      subjectsRepository,
      trailsRepository,
    )

    author = await makeUser()
    trail = makeTrail()

    project = makeProject({
      authorId: author.id,
      trails: new Set([trail.id]),
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await projectsRepository.create(project)

    sut = new FetchPostsUseCase(projectsRepository)
  })

  it('should be able to fetch posts', async () => {
    const result = await sut.execute()

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })
})
