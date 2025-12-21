import { type Either, left, right } from '@/@shared/kernel/either'
import { ForbiddenError } from '@/@shared/kernel/errors/forbidden.error'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { Injectable } from '@nestjs/common'
import { ProjectsRepository } from '../repositories/projects-repository'

interface DeleteProjectUseCaseRequest {
  studentId: string
  projectId: string
}

type DeleteProjectUseCaseResponse = Either<
  ForbiddenError | ResourceNotFoundError,
  void
>

@Injectable()
export class DeleteProjectUseCase {
  constructor(private projectRepository: ProjectsRepository) {}

  async execute({
    studentId,
    projectId,
  }: DeleteProjectUseCaseRequest): Promise<DeleteProjectUseCaseResponse> {
    const project = await this.projectRepository.findById(projectId)

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
