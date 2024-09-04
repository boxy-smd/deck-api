import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository.ts'
import { InMemoryProjectCommentsRepository } from 'test/repositories/project-comments-repository.ts'
import { InMemoryProjectProfessorsRepository } from 'test/repositories/project-professors-repository.ts'
import { InMemoryProjectTrailsRepository } from 'test/repositories/project-trails-repository.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemoryStudentTrailsRepository } from 'test/repositories/student-trails-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import { CommentOnProjectUseCase } from './comment-on-project.ts'

let projectsRepository: InMemoryProjectsRepository
let studentsRepository: InMemoryStudentsRepository
let studentTrailsRepository: InMemoryStudentTrailsRepository
let subjectsRepository: InMemorySubjectsRepository
let projectTrailsRepository: InMemoryProjectTrailsRepository
let projectProfessorsRepository: InMemoryProjectProfessorsRepository
let projectCommentsRepository: InMemoryProjectCommentsRepository
let trailsRepository: InMemoryTrailsRepository
let professorsRepository: InMemoryProfessorsRepository

let sut: CommentOnProjectUseCase

describe('comment on project use case', () => {
  beforeEach(() => {
    studentTrailsRepository = new InMemoryStudentTrailsRepository()
    studentsRepository = new InMemoryStudentsRepository(studentTrailsRepository)
    projectTrailsRepository = new InMemoryProjectTrailsRepository()
    projectProfessorsRepository = new InMemoryProjectProfessorsRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    professorsRepository = new InMemoryProfessorsRepository()
    projectCommentsRepository = new InMemoryProjectCommentsRepository(
      studentsRepository,
    )

    projectsRepository = new InMemoryProjectsRepository(
      projectTrailsRepository,
      projectProfessorsRepository,
      projectCommentsRepository,
      studentsRepository,
      subjectsRepository,
      trailsRepository,
      professorsRepository,
    )

    sut = new CommentOnProjectUseCase(
      projectsRepository,
      studentsRepository,
      projectCommentsRepository,
    )
  })

  it('should return a ResourceNotFoundError if project does not exist', async () => {
    const author = await makeStudent()
    const project = makeProject({ authorId: author.id })

    const response = await sut.execute({
      authorId: author.id.toString(),
      content: 'comment content',
      projectId: project.id.toString(),
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return a ResourceNotFoundError if author does not exist', async () => {
    const project = makeProject()

    const response = await sut.execute({
      authorId: 'non-existing-author-id',
      content: 'comment content',
      projectId: project.id.toString(),
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
