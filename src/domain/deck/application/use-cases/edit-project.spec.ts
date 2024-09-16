import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { InMemoryCommentsRepository } from 'test/repositories/comments-repository.ts'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import type { Project } from '../../enterprise/entities/project.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import { EditProjectUseCase } from './edit-project.ts'

let projectsRepository: InMemoryProjectsRepository
let studentsRepository: InMemoryStudentsRepository
let subjectsRepository: InMemorySubjectsRepository
let commentsRepository: InMemoryCommentsRepository
let trailsRepository: InMemoryTrailsRepository
let professorsRepository: InMemoryProfessorsRepository

let author: Student
let trail: Trail
let project: Project

let sut: EditProjectUseCase

describe('edit project use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    commentsRepository = new InMemoryCommentsRepository(studentsRepository)
    professorsRepository = new InMemoryProfessorsRepository()

    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      subjectsRepository,
      commentsRepository,
    )

    author = await makeStudent()
    trail = makeTrail()
    project = makeProject({
      authorId: author.id,
      status: 'DRAFT',
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await projectsRepository.create(project)

    sut = new EditProjectUseCase(
      projectsRepository,
      studentsRepository,
      subjectsRepository,
      trailsRepository,
      professorsRepository,
    )
  })

  it('should be able to edit a project', async () => {
    const response = await sut.execute({
      studentId: author.id.toString(),
      projectId: project.id.toString(),
      status: 'PUBLISHED',
    })

    expect(response.isRight()).toBe(true)
    expect(response.isRight() && response.value.status).toBe('PUBLISHED')
  })

  it('should not be able to edit a project that does not exist', async () => {
    const response = await sut.execute({
      studentId: author.id.toString(),
      projectId: 'invalid-id',
      status: 'PUBLISHED',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.isLeft() && response.value).toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})
