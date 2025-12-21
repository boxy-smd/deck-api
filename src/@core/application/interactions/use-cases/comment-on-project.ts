import { Injectable } from '@nestjs/common'
import { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import { ProjectStatus } from '@/@core/domain/projects/value-objects/project-status'
import type { StudentProfile } from '@/@core/domain/users/entities/student-profile'
import { type Either, left, right } from '@/@shared/kernel/either'
import { ForbiddenError } from '@/@shared/kernel/errors/forbidden.error'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { ProjectsRepository } from '../../projects/repositories/projects-repository'
import { CommentsRepository } from '../repositories/comments-repository'

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

@Injectable()
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

    if (project.status !== ProjectStatus.PUBLISHED) {
      return left(
        new ForbiddenError(
          'Não é possível comentar em projetos que não estão publicados.',
        ),
      )
    }

    if (!project.allowComments) {
      return left(new ForbiddenError('Este projeto não permite comentários.'))
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
