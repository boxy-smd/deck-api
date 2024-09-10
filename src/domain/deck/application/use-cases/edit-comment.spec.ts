import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
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
import { EditCommentUseCase } from './edit-comment.ts'

let projectsRepository: InMemoryProjectsRepository
let studentsRepository: InMemoryStudentsRepository
let subjectsRepository: InMemorySubjectsRepository
let commentsRepository: InMemoryCommentsRepository

let author: Student
let comment: Comment
let project: Project

let sut: EditCommentUseCase

describe('edit comment use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    commentsRepository = new InMemoryCommentsRepository(studentsRepository)

    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      subjectsRepository,
    )

    author = await makeStudent()
    comment = makeComment({ authorId: author.id })
    project = makeProject({
      comments: [comment],
    })

    await studentsRepository.create(author)
    await projectsRepository.create(project)
    await commentsRepository.create(comment)

    sut = new EditCommentUseCase(
      projectsRepository,
      studentsRepository,
      commentsRepository,
    )
  })

  it('should be able to edit a comment', async () => {
    const result = await sut.execute({
      authorId: author.id.toString(),
      projectId: project.id.toString(),
      content: 'Bad project! >:(',
      commentId: comment.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      content: 'Bad project! >:(',
    })
  })

  it('should not be able to edit a comment from a non-existent project', async () => {
    const result = await sut.execute({
      authorId: author.id.toString(),
      projectId: 'non-existent-project',
      content: 'Bad project! >:(',
      commentId: comment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a comment from a non-existent author', async () => {
    const result = await sut.execute({
      authorId: 'non-existent-author',
      projectId: project.id.toString(),
      content: 'Bad project! >:(',
      commentId: comment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a non-existent comment', async () => {
    const result = await sut.execute({
      authorId: author.id.toString(),
      projectId: project.id.toString(),
      content: 'Bad project! >:(',
      commentId: 'non-existent-comment',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
