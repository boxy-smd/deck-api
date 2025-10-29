import type { ProjectsRepository } from '@/@core/domain/projects/application/repositories/projects-repository'
import { type Either, left, right } from '@/@shared/kernel/either'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import type { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'
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

export class ListProjectCommentsUseCase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute(
    request: ListProjectCommentsUseCaseRequest,
  ): Promise<ListProjectCommentsUseCaseResponse> {
    const { projectId } = request

    // Verificar se projeto existe
    const project = await this.projectsRepository.findById(projectId)
    if (!project) {
      return left(new ResourceNotFoundError('Projeto não encontrado.'))
    }

    // Buscar comentários do projeto
    const comments =
      await this.commentsRepository.findManyByProjectIdWithAuthors(projectId)

    return right({
      comments,
    })
  }
}
