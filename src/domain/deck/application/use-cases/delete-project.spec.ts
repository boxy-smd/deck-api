import { ForbiddenError } from '@/core/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { InMemoryCommentsRepository } from 'test/repositories/comments-repository.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import type { Project } from '../../enterprise/entities/project.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import { DeleteProjectUseCase } from './delete-project.ts'

let studentsRepository: InMemoryStudentsRepository
let trailsRepository: InMemoryTrailsRepository
let subjectsRepository: InMemorySubjectsRepository
let commentsRepository: InMemoryCommentsRepository
let projectsRepository: InMemoryProjectsRepository

let author: Student
let trail: Trail
let project: Project

let sut: DeleteProjectUseCase

describe('delete project use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    commentsRepository = new InMemoryCommentsRepository(studentsRepository)
    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      subjectsRepository,
      commentsRepository,
    )

    author = await makeStudent()
    trail = makeTrail()
    project = makeProject({
      authorId: author.id,
      trails: [trail],
    })

    await studentsRepository.save(author)
    await trailsRepository.save(trail)
    await projectsRepository.save(project)

    sut = new DeleteProjectUseCase(projectsRepository)
  })

  it('should be able to delete a project', async () => {
    const response = await sut.execute({
      studentId: author.id.toString(),
      projectId: project.id.toString(),
    })

    expect(response.isRight()).toBe(true)
    expect(await projectsRepository.findById(project.id.toString())).toBe(null)
  })

  it('should not be able to delete a project that does not exist', async () => {
    const response = await sut.execute({
      studentId: author.id.toString(),
      projectId: 'invalid-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a project that does not belong to the student', async () => {
    const otherAuthor = await makeStudent()
    await studentsRepository.save(otherAuthor)

    const response = await sut.execute({
      studentId: otherAuthor.id.toString(),
      projectId: project.id.toString(),
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ForbiddenError)
  })
})
