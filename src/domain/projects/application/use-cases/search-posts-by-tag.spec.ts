import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository.ts'
import { StudentProfile } from '@/domain/authentication/enterprise/entities/student-profile.ts'
import type { User } from '@/domain/authentication/enterprise/entities/user.ts'
import { Semester } from '@/domain/authentication/enterprise/value-objects/semester.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeSubject } from 'test/factories/make-subject.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { makeUser } from 'test/factories/make-user.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import { InMemoryUsersRepository } from 'test/repositories/users-repository.ts'
import type { Project } from '../../../projects/enterprise/entities/project.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'
import type { SubjectsRepository } from '../repositories/subjects-repository.ts'
import type { TrailsRepository } from '../repositories/trails-repository.ts'
import { SearchPostsByTagUseCase } from './search-posts-by-tag.ts'

let projectsRepository: ProjectsRepository
let studentsRepository: UsersRepository
let trailsRepository: TrailsRepository
let subjectsRepository: SubjectsRepository

let author: User
let trail: Trail
let project: Project

let sut: SearchPostsByTagUseCase

describe('search posts by tag use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryUsersRepository()
    trailsRepository = new InMemoryTrailsRepository()
    subjectsRepository = new InMemorySubjectsRepository()

    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      subjectsRepository,
      trailsRepository,
      undefined,
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

    sut = new SearchPostsByTagUseCase(projectsRepository)
  })

  it('should be able to search posts by trail tag', async () => {
    const result = await sut.execute({
      tag: 'Design',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should be able to search posts by subject tag', async () => {
    const result = await sut.execute({
      tag: 'Comunicação',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should be able to search posts by year tag', async () => {
    const result = await sut.execute({
      tag: '2024',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should be able to search posts by semester (digit) tag', async () => {
    const result = await sut.execute({
      tag: '3',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should be able to search posts by semester (ordinal) tag', async () => {
    const result = await sut.execute({
      tag: '3º',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should be able to search posts by semester (word) tag', async () => {
    const result = await sut.execute({
      tag: 'terceiro',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should not return any post when tag does not match', async () => {
    const result = await sut.execute({
      tag: 'Not found',
    })

    expect(result).length(0)
  })
})
