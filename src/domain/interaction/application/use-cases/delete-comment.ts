import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository.ts'
import { type Either, left, right } from '@/shared/either.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'
import type { ProjectsRepository } from '../../../projects/application/repositories/projects-repository.ts'

interface DeleteCommentUseCaseRequest {
  authorId: string
  projectId: string
  commentId: string
}

type DeleteCommentUseCaseResponse = Either<
  ForbiddenError | ResourceNotFoundError,
  void
>

export class DeleteCommentUseCase {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
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

    const author = await this.usersRepository.findById(
      new UniqueEntityID(authorId),
    )

    if (!author) {
      return left(new ResourceNotFoundError('Autor não encontrado.'))
    }

    const project = await this.projectsRepository.findById(
      new UniqueEntityID(projectId),
    )

    if (!project) {
      return left(new ResourceNotFoundError('Projeto não encontrado.'))
    }

    const comment = project.comments.find(c => c.id.toString() === commentId)

    if (!comment) {
      return left(new ResourceNotFoundError('Comentário não encontrado.'))
    }

    if (
      authorId !== comment.authorId.toString() &&
      authorId !== project.authorId.toString()
    ) {
      return left(
        new ForbiddenError(
          'Você não tem permissão para deletar este comentário.',
        ),
      )
    }

    project.removeComment(comment)

    await this.projectsRepository.save(project)

    return right(undefined)
  }
}
