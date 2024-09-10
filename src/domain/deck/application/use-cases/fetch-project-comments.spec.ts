import { makeComment } from 'test/factories/make-comment.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { InMemoryCommentsRepository } from 'test/repositories/comments-repository.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import type { Comment } from '../../enterprise/entities/comment.ts'
import type { Project } from '../../enterprise/entities/project.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import { FetchProjectCommentsUseCase } from './fetch-project-comments.ts'

let projectsRepository: InMemoryProjectsRepository
let studentsRepository: InMemoryStudentsRepository
let subjectsRepository: InMemorySubjectsRepository
let commentsRepository: InMemoryCommentsRepository

let author: Student
let comment: Comment
let project: Project

let sut: FetchProjectCommentsUseCase

describe('fetch project comments use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    commentsRepository = new InMemoryCommentsRepository(studentsRepository)

    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      subjectsRepository,
    )

    author = await makeStudent()
    project = makeProject()
    comment = makeComment({ authorId: author.id, projectId: project.id })

    project.comments = [comment]

    await studentsRepository.create(author)
    await commentsRepository.create(comment)
    await projectsRepository.create(project)

    sut = new FetchProjectCommentsUseCase(commentsRepository)
  })

  it('should be able to fetch project comments', async () => {
    const result = await sut.execute({
      projectId: project.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value.comments).toHaveLength(1)
    expect(result.isRight() && result.value.comments[0].content).toEqual(
      'Great project!',
    )
  })
})
