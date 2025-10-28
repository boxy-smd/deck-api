import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository.ts'
import { StudentProfile } from '@/domain/authentication/enterprise/entities/student-profile.ts'
import type { User } from '@/domain/authentication/enterprise/entities/user.ts'
import { Semester } from '@/domain/authentication/enterprise/value-objects/semester.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'
import { makeProfessor } from 'test/factories/make-professor.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { makeUser } from 'test/factories/make-user.ts'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import { InMemoryUsersRepository } from 'test/repositories/users-repository.ts'
import type { Project } from '../../../projects/enterprise/entities/project.ts'
import type { Professor } from '../../enterprise/entities/professor.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import type { ProfessorsRepository } from '../repositories/professors-repository.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'
import type { TrailsRepository } from '../repositories/trails-repository.ts'
import { SearchPostsByProfessorUseCase } from './search-posts-by-professor-name.ts'

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
