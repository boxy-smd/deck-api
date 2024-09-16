import { ForbiddenError } from '@/core/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import { makeComment } from 'test/factories/make-comment.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { InMemoryCommentsRepository } from 'test/repositories/comments-repository.ts'
import { InMemoryReportsRepository } from 'test/repositories/reports-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import type { Comment } from '../../enterprise/entities/comment.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import { ReportCommentUseCase } from './report-comment.ts'

let studentsRepository: InMemoryStudentsRepository
let commentsRepository: InMemoryCommentsRepository
let reportsRepository: InMemoryReportsRepository

let author: Student
let comment: Comment

let sut: ReportCommentUseCase

describe('report comment use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    commentsRepository = new InMemoryCommentsRepository(studentsRepository)
    reportsRepository = new InMemoryReportsRepository()

    author = await makeStudent()
    comment = makeComment()

    await studentsRepository.create(author)
    await commentsRepository.create(comment)

    sut = new ReportCommentUseCase(
      reportsRepository,
      commentsRepository,
      studentsRepository,
    )
  })

  it('should be able to report a comment', async () => {
    const result = await sut.execute({
      content: 'This comment is inappropriate.',
      authorId: author.id.toString(),
      commentId: comment.id.toString(),
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to report a comment with an invalid author', async () => {
    const result = await sut.execute({
      content: 'This comment is inappropriate.',
      authorId: '',
      commentId: comment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ForbiddenError)
  })

  it('should not be able to report a comment with an invalid comment id', async () => {
    const result = await sut.execute({
      content: 'This comment is inappropriate.',
      authorId: '123',
      commentId: 'invalid-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
