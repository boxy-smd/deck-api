import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository'
import type { User } from '@/domain/authentication/enterprise/entities/user'
import { makeProject } from 'test/factories/make-project'
import { makeTrail } from 'test/factories/make-trail'
import { makeUser } from 'test/factories/make-user'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import { Project } from '../../enterprise/entities/project'
import type { Trail } from '../../enterprise/entities/trail'
import type { ProjectsRepository } from '../repositories/projects-repository'
import type { SubjectsRepository } from '../repositories/subjects-repository'
import type { TrailsRepository } from '../repositories/trails-repository'
import { GetProjectUseCase } from './get-project'

let studentsRepository: UsersRepository
let subjectsRepository: SubjectsRepository
let trailsRepository: TrailsRepository
let projectsRepository: ProjectsRepository

let author: User
let trail: Trail
let project: Project

let sut: GetProjectUseCase

describe('get project use case', () => {
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

    sut = new GetProjectUseCase(projectsRepository)
  })

  it('should be able to get a project', async () => {
    await projectsRepository.create(project)

    const result = await sut.execute({
      projectId: project.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(Project)
  })
})
