import { type Either, left, right } from '@/core/either.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'

interface DeleteProjectUseCaseRequest {
  projectId: string
}

type DeleteProjectUseCaseResponse = Either<ResourceNotFoundError, void>

export class DeleteProjectUseCase {
  constructor(private projectRepository: ProjectsRepository) {}

  async execute({
    projectId,
  }: DeleteProjectUseCaseRequest): Promise<DeleteProjectUseCaseResponse> {
    const project = await this.projectRepository.findById(projectId)

    if (!project) {
      return left(new ResourceNotFoundError('Project not found.'))
    }

    await this.projectRepository.delete(projectId)

    return right(undefined)
  }
}
