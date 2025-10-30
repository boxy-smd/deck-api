import type { UsersRepository } from '@/@core/domain/authentication/application/repositories/users-repository'
import type { CommentsRepository } from '@/@core/domain/interaction/application/repositories/comments-repository'
import { type Either, left, right } from '@/@shared/kernel/either'
import { ForbiddenError } from '@/@shared/kernel/errors/forbidden.error'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { Injectable } from '@nestjs/common'

interface DeleteCommentUseCaseRequest {
  authorId: string
  projectId: string
  commentId: string
}

type DeleteCommentUseCaseResponse = Either<
  ForbiddenError | ResourceNotFoundError,
  void
>

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({
    authorId,
    projectId,
    commentId,
  }: DeleteCommentUseCaseRequest): Promise<DeleteCommentUseCaseResponse> {
    if (!authorId) {
      return left(
        new ForbiddenError(
          'Você deve estar logado para deletar um comentário.',
        ),
      )
    }

    const author = await this.usersRepository.findById(authorId)

    if (!author) {
      return left(new ResourceNotFoundError('Autor não encontrado.'))
    }

    const comment = await this.commentsRepository.findById(commentId)

    if (!comment) {
      return left(new ResourceNotFoundError('Comentário não encontrado.'))
    }

    if (comment.projectId.toString() !== projectId) {
      return left(
        new ResourceNotFoundError('Comentário não encontrado neste projeto.'),
      )
    }

    if (comment.authorId.toString() !== authorId) {
      return left(
        new ForbiddenError(
          'Você não tem permissão para deletar este comentário.',
        ),
      )
    }

    await this.commentsRepository.delete(comment)

    return right(undefined)
  }
}
