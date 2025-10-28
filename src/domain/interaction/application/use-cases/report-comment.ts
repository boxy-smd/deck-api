import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository.ts'
import type { CommentsRepository } from '@/domain/interaction/application/repositories/comments-repository.ts'
import type { ReportsRepository } from '@/domain/interaction/application/repositories/reports-repository.ts'
import { type Either, left, right } from '@/shared/either.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error.ts'
import { Report } from '../../enterprise/entities/report.ts'

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
      return left(new ResourceNotFoundError('Comment not found in this project.'))
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
