import { type Either, left, right } from '@/core/either.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import type { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-autor.ts'
import type { ProjectCommentsRepository } from '../repositories/project-comments-repository.ts'

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
  constructor(
    private readonly projectCommentsRepository: ProjectCommentsRepository,
  ) {}

  async execute({
    projectId,
  }: FetchProjectCommentsUseCaseRequest): Promise<FetchProjectCommentsUseCaseResponse> {
    const comments =
      await this.projectCommentsRepository.findManyByProjectIdWitAuthor(
        projectId,
      )

    if (!comments) {
      return left(new ResourceNotFoundError('Comments not found.'))
    }

    return right({
      comments,
    })
  }
}
