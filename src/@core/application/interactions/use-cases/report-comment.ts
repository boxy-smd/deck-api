import { Injectable } from '@nestjs/common'
import { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import { type Either, left, right } from '@/@shared/kernel/either'
import { ForbiddenError } from '@/@shared/kernel/errors/forbidden.error'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { Report } from '../../../domain/interactions/entities/report'
import { CommentsRepository } from '../repositories/comments-repository'
import { ReportsRepository } from '../repositories/reports-repository'

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

@Injectable()
export class ReportCommentUseCase {
  constructor(
    private usersRepository: UsersRepository,
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

    const student = await this.usersRepository.findById(authorId)

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
