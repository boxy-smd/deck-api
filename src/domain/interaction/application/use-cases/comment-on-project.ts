import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository.ts'
import type { StudentProfile } from '@/domain/authentication/enterprise/entities/student-profile.ts'
import { type Either, left, right } from '@/shared/either.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'
import type { ProjectsRepository } from '../../../projects/application/repositories/projects-repository.ts'

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

    const comment = project.comment(
      content,
      new UniqueEntityID<StudentProfile>(authorId),
    )

    await this.projectsRepository.create(project)

    return right({
      commentId: comment.id.toString(),
    })
  }
}
