import type { UsersRepository } from '@/@core/domain/authentication/application/repositories/users-repository'
import { StudentProfile } from '@/@core/domain/authentication/enterprise/entities/student-profile'
import type { User } from '@/@core/domain/authentication/enterprise/entities/user'
import { Semester } from '@/@core/domain/authentication/enterprise/value-objects/semester'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { makeProfessor } from 'test/factories/make-professor'
import { makeProject } from 'test/factories/make-project'
import { makeTrail } from 'test/factories/make-trail'
import { makeUser } from 'test/factories/make-user'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import type { Project } from '../../../projects/enterprise/entities/project'
import type { Professor } from '../../enterprise/entities/professor'
import type { Trail } from '../../enterprise/entities/trail'
import type { ProfessorsRepository } from '../repositories/professors-repository'
import type { ProjectsRepository } from '../repositories/projects-repository'
import type { TrailsRepository } from '../repositories/trails-repository'
import { SearchPostsByProfessorUseCase } from './search-posts-by-professor-name'

let projectsRepository: ProjectsRepository
let studentsRepository: UsersRepository
let trailsRepository: TrailsRepository
let professorsRepository: ProfessorsRepository

let author: User
let trail: Trail
let professor: Professor
let project: Project

let sut: SearchPostsByProfessorUseCase

describe('search posts by professor name use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryUsersRepository()
    trailsRepository = new InMemoryTrailsRepository()
    professorsRepository = new InMemoryProfessorsRepository()

    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      undefined,
      trailsRepository,
      professorsRepository,
    )

    const id = UniqueEntityID.create()

    author = await makeUser(
      {
        profile: StudentProfile.create(
          { semester: Semester.create(1).value as Semester },
          id,
        ),
      },
      id,
    )

    trail = makeTrail()

    professor = makeProfessor({
      name: 'Dio Brando',
    })

    project = makeProject({
      title: 'Awesome project',
      authorId: author.id,
      trails: new Set([trail.id]),
      professors: new Set([professor.id]),
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await professorsRepository.create(professor)
    await projectsRepository.create(project)

    sut = new SearchPostsByProfessorUseCase(projectsRepository)
  })

  it('should be able to search posts by professor name', async () => {
    const result = await sut.execute({
      name: 'Dio',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should be able to search posts by professor name case insensitive', async () => {
    const result = await sut.execute({
      name: 'dio',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should be able to search posts by professor name with partial match', async () => {
    const result = await sut.execute({
      name: 'Di',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should not return any post when professor name does not match', async () => {
    const result = await sut.execute({
      name: 'Not found',
    })

    expect(result).length(0)
  })
})
