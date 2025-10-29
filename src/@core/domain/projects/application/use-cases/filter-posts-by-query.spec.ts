import type { UsersRepository } from '@/@core/domain/authentication/application/repositories/users-repository'
import type { User } from '@/@core/domain/authentication/enterprise/entities/user'
import { makeProject } from 'test/factories/make-project'
import { makeSubject } from 'test/factories/make-subject'
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
import { FilterPostsByQueryUseCase } from './filter-posts-by-query'

let projectsRepository: ProjectsRepository
let studentsRepository: UsersRepository
let subjectsRepository: SubjectsRepository
let trailsRepository: TrailsRepository

let author: User
let trail: Trail
let project: Project

let sut: FilterPostsByQueryUseCase

describe('filter posts by query use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryUsersRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()

    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      subjectsRepository,
      trailsRepository,
      undefined,
    )

    author = await makeUser()
    trail = makeTrail({
      name: 'Design',
    })
    const subject = makeSubject({
      name: 'Comunicação Visual I',
    })

    project = makeProject({
      title: 'Awesome project',
      authorId: author.id,
      trails: new Set([trail.id]),
      subjectId: subject.id,
      publishedYear: 2024,
      semester: 3,
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await subjectsRepository.create(subject)
    await projectsRepository.create(project)

    sut = new FilterPostsByQueryUseCase(projectsRepository)
  })

  it('should be able to filter posts by trails ids', async () => {
    const result = await sut.execute({
      trailsIds: [trail.id.toString()],
    })

    expect(result).length(1)
    expect(result[0].id).toBe(project.id.toString())
  })

  it('should be able to filter posts by semester', async () => {
    const result = await sut.execute({
      semester: 3,
    })

    expect(result).length(1)
    expect(result[0].id).toBe(project.id.toString())
  })

  it('should be able to filter posts by subject id', async () => {
    const result = await sut.execute({
      subjectId: project.subjectId?.toString(),
    })

    expect(result).length(1)
    expect(result[0].id).toBe(project.id.toString())
  })

  it('should be able to filter posts by published year', async () => {
    const result = await sut.execute({
      publishedYear: 2024,
    })

    expect(result).length(1)
    expect(result[0].id).toBe(project.id.toString())
  })

  it('should be able to filter posts by all queries', async () => {
    const result = await sut.execute({
      trailsIds: [trail.id.toString()],
      semester: 3,
      subjectId: project.subjectId?.toString(),
      publishedYear: 2024,
    })

    expect(result).length(1)
    expect(result[0].id).toBe(project.id.toString())
  })

  it('should return an empty array if no posts are found', async () => {
    const result = await sut.execute({
      trailsIds: ['invalid-id'],
    })

    expect(result).length(0)
  })
})
