import { type Either, left, right } from '@/shared/either.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'

interface DeleteProjectUseCaseRequest {
  studentId: string
  projectId: string
}

type DeleteProjectUseCaseResponse = Either<
  ForbiddenError | ResourceNotFoundError,
  void
>

export class DeleteProjectUseCase {
  constructor(private projectRepository: ProjectsRepository) {}

  async execute({
    studentId,
    projectId,
  }: DeleteProjectUseCaseRequest): Promise<DeleteProjectUseCaseResponse> {
    const project = await this.projectRepository.findById(
      new UniqueEntityID(projectId),
    )

    if (!project) {
      return left(new ResourceNotFoundError('Projeto não encontrado.'))
    }

    if (project.authorId.toString() !== studentId) {
      return left(
        new ForbiddenError('Você não tem permissão para deletar este projeto.'),
      )
    }

    await this.projectRepository.delete(project)

    return right(undefined)
  }
}
