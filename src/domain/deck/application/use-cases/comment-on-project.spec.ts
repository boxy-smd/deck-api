import { makeProject } from 'test/factories/make-project.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { InMemoryCommentsRepository } from 'test/repositories/comments-repository.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import type { Project } from '../../enterprise/entities/project.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import { CommentOnProjectUseCase } from './comment-on-project.ts'

let studentsRepository: InMemoryStudentsRepository
let commentsRepository: InMemoryCommentsRepository
let subjectsRepository: InMemorySubjectsRepository
let projectsRepository: InMemoryProjectsRepository

let author: Student
let project: Project

let sut: CommentOnProjectUseCase

describe('comment on project use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    commentsRepository = new InMemoryCommentsRepository(studentsRepository)
    subjectsRepository = new InMemorySubjectsRepository()
    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      subjectsRepository,
    )

    author = await makeStudent()
    project = makeProject()

    await studentsRepository.create(author)
    await projectsRepository.create(project)

    sut = new CommentOnProjectUseCase(
      commentsRepository,
      projectsRepository,
      studentsRepository,
    )
  })

  it('should be able to comment on a project', async () => {
    const result = await sut.execute({
      authorId: author.id.toString(),
      projectId: project.id.toString(),
      content: 'Great project!',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        commentId: expect.any(String),
      }),
    )
  })
})
