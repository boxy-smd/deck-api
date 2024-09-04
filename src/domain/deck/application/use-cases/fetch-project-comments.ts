import { type Either, left, right } from '@/core/either.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import type { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author.ts'
import type { CommentsRepository } from '../repositories/comments-repository.ts'

interface FetchProjectCommentsUseCaseRequest {
  projectId: string
}

type FetchProjectCommentsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    comments: CommentWithAuthor[]
  }
>

export class FetchProjectCommentsUseCase {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute({
    projectId,
  }: FetchProjectCommentsUseCaseRequest): Promise<FetchProjectCommentsUseCaseResponse> {
    const comments =
      await this.commentsRepository.findManyByProjectIdWithAuthors(projectId)

    if (!comments) {
      return left(new ResourceNotFoundError('Comments not found.'))
    }

    return right({
      comments,
    })
  }
}
