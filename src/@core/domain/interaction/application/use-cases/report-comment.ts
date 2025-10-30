import type { UsersRepository } from '@/@core/domain/authentication/application/repositories/users-repository'
import type { CommentsRepository } from '@/@core/domain/interaction/application/repositories/comments-repository'
import type { ReportsRepository } from '@/@core/domain/interaction/application/repositories/reports-repository'
import { type Either, left, right } from '@/@shared/kernel/either'
import { ForbiddenError } from '@/@shared/kernel/errors/forbidden.error'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { Report } from '../../enterprise/entities/report'

interface ReportCommentUseCaseRequest {
  content: string
  authorId: string
  projectId: string
  commentId: string
}

type ReportCommentUseCaseResponse = Either<
  ForbiddenError | ResourceNotFoundError,
  void
>

export class ReportCommentUseCase {
  constructor(
    private studentsRepository: UsersRepository,
    private commentsRepository: CommentsRepository,
    private reportsRepository: ReportsRepository,
  ) {}

  async execute({
    content,
    authorId,
    projectId,
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

    if (comment.projectId.toString() !== projectId) {
      return left(
        new ResourceNotFoundError('Comment not found in this project.'),
      )
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

    await this.reportsRepository.create(report)

    return right(undefined)
  }
}
