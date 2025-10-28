import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository.ts'
import type { User } from '@/domain/authentication/enterprise/entities/user.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { makeUser } from 'test/factories/make-user.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import { InMemoryUsersRepository } from 'test/repositories/users-repository.ts'
import { Project } from '../../enterprise/entities/project.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'
import type { SubjectsRepository } from '../repositories/subjects-repository.ts'
import type { TrailsRepository } from '../repositories/trails-repository.ts'
import { GetProjectUseCase } from './get-project.ts'

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
