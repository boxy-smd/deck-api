import { type Either, left, right } from '@/core/either.ts'
import { ForbiddenError } from '@/core/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import { Report } from '../../enterprise/entities/report.ts'
import type { CommentsRepository } from '../repositories/comments-repository.ts'
import type { ReportsRepository } from '../repositories/reports-repository.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'

interface ReportCommentUseCaseRequest {
  content: string
  authorId: string
  commentId: string
}

type ReportCommentUseCaseResponse = Either<
  ForbiddenError | ResourceNotFoundError,
  void
>

export class ReportCommentUseCase {
  constructor(
    private reportsRepository: ReportsRepository,
    private commentsRepository: CommentsRepository,
    private studentsRepository: StudentsRepository,
  ) {}

  async execute({
    content,
    authorId,
    commentId,
  }: ReportCommentUseCaseRequest): Promise<ReportCommentUseCaseResponse> {
    if (!authorId) {
      return left(
        new ForbiddenError('You must be logged in to report a comment.'),
      )
    }

    const comment = await this.commentsRepository.findById(commentId)

    if (!comment) {
      return left(new ResourceNotFoundError('Comment not found.'))
    }

    const student = await this.studentsRepository.findById(authorId)

    if (!student) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    const report = Report.create({
      content,
      authorId: student.id,
      commentId: comment.id,
      isResolved: false,
    })

    await this.reportsRepository.save(report)

    return right(undefined)
  }
}
