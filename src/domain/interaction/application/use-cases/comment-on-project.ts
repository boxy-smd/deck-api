import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository'
import type { StudentProfile } from '@/domain/authentication/enterprise/entities/student-profile'
import type { CommentsRepository } from '@/domain/interaction/application/repositories/comments-repository'
import { type Either, left, right } from '@/shared/either'
import { ForbiddenError } from '@/shared/errors/forbidden.error'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id'
import type { ProjectsRepository } from '../../../projects/application/repositories/projects-repository'

interface CommentOnProjectUseCaseRequest {
  content: string
  authorId: string
  projectId: string
}

type CommentOnProjectUseCaseResponse = Either<
  ForbiddenError | ResourceNotFoundError,
  {
    commentId: string
  }
>

export class CommentOnProjectUseCase {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async execute({
    authorId,
    projectId,
    content,
  }: CommentOnProjectUseCaseRequest): Promise<CommentOnProjectUseCaseResponse> {
    if (!authorId) {
      return left(
        new ForbiddenError(
          'Você deve estar logado para comentar em um projeto.',
        ),
      )
    }

    const author = await this.usersRepository.findById(authorId)

    if (!author) {
      return left(new ResourceNotFoundError('Autor não encontrado.'))
    }

    const project = await this.projectsRepository.findById(projectId)

    if (!project) {
      return left(new ResourceNotFoundError('Projeto não encontrado.'))
    }

    const comment = project.comment(
      content,
      new UniqueEntityID<StudentProfile>(authorId),
    )

    await this.commentsRepository.create(comment)

    return right({
      commentId: comment.id.toString(),
    })
  }
}
