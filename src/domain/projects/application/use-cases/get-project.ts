import { type Either, left, right } from '@/shared/either.ts'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'
import type { Project } from '../../enterprise/entities/project.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'

interface GetProjectUseCaseRequest {
  projectId: string
}

type GetProjectUseCaseResponse = Either<ResourceNotFoundError, Project>

export class GetProjectUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    projectId,
  }: GetProjectUseCaseRequest): Promise<GetProjectUseCaseResponse> {
    const project = await this.projectsRepository.findById(
      UniqueEntityID.create(projectId),
    )

    if (!project) {
      return left(new ResourceNotFoundError('Project not found.'))
    }

    return right(project)
  }
}
