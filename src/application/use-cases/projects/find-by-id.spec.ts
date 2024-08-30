import { beforeEach, describe, expect, it } from 'vitest'

import { Professor } from '@/domain/entities/professor.entity.ts'
import { Project } from '@/domain/entities/project.entity.ts'
import { Subject } from '@/domain/entities/subject.entity.ts'
import { Trail } from '@/domain/entities/trail.entity.ts'
import { User } from '@/domain/entities/user.entity.ts'
import { InMemoryProfessorsRepository } from '@/infra/database/in-memory/repositories/professors-repository.ts'
import { InMemoryProjectsRepository } from '@/infra/database/in-memory/repositories/projects-repository.ts'
import { InMemorySubjectsRepository } from '@/infra/database/in-memory/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from '@/infra/database/in-memory/repositories/trails-repository.ts'
import { InMemoryUsersRepository } from '@/infra/database/in-memory/repositories/users-repository.ts'
import { ProjectNotFoundError } from './errors/project-not-found.ts'
import { FindProjectByIdUseCase } from './find-by-id.ts'

let projectsRepository: InMemoryProjectsRepository
let professorsRepository: InMemoryProfessorsRepository
let subjectsRepository: InMemorySubjectsRepository
let trailsRepository: InMemoryTrailsRepository
let usersRepository: InMemoryUsersRepository
let sut: FindProjectByIdUseCase
let author: User
let subject: Subject
let trail: Trail
let professor: Professor

describe('find project by id use case', () => {
  beforeEach(() => {
    projectsRepository = new InMemoryProjectsRepository(
      professorsRepository,
      trailsRepository,
    )
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    professorsRepository = new InMemoryProfessorsRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new FindProjectByIdUseCase(projectsRepository)

    const authorOrError = User.create({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@alu.ufc.br',
      passwordHash: 'password-hash',
      semester: 3,
    })

    if (authorOrError.isLeft()) {
      throw authorOrError.value
    }

    author = authorOrError.value

    subject = Subject.create({
      name: 'Subject Name',
    })

    trail = Trail.create({
      name: 'Trail',
    })

    professor = Professor.create({
      name: 'Professor',
    })

    subjectsRepository.create(subject)
    trailsRepository.create(trail)
    professorsRepository.create(professor)
    usersRepository.create(author)
  })

  it('should return a project by id', async () => {
    const project = Project.create({
      title: 'Project Title',
      description: 'Project Description',
      publishedYear: 2021,
      authorId: author.id,
      professors: [professor],
      subjectId: subject.id,
      trails: [trail],
      allowComments: true,
      bannerUrl: 'http://banner-url.com',
      semester: 3,
      status: 'DRAFT',
    })

    projectsRepository.create(project)

    const response = await sut.execute({ id: project.id })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual(project)
  })

  it('should return a project not found error', async () => {
    const response = await sut.execute({ id: 'invalid-id' })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ProjectNotFoundError)
  })
})
