import { type Either, left, right } from '@/@shared/kernel/either'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { Injectable } from '@nestjs/common'
import type { CommentWithAuthor } from '../../../domain/interactions/value-objects/comment-with-author'
import type { ProjectsRepository } from '../../projects/repositories/projects-repository'
import type { CommentsRepository } from '../repositories/comments-repository'

interface ListProjectCommentsUseCaseRequest {
  projectId: string
}

type ListProjectCommentsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class ListProjectCommentsUseCase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute(
    request: ListProjectCommentsUseCaseRequest,
  ): Promise<ListProjectCommentsUseCaseResponse> {
    const { projectId } = request

    const project = await this.projectsRepository.findById(projectId)
    if (!project) {
      return left(new ResourceNotFoundError('Projeto não encontrado.'))
    }

    const comments =
      await this.commentsRepository.findManyByProjectIdWithAuthors(projectId)

    return right({
      comments,
    })
  }
}
