import { type Either, left, right } from '@/core/either.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import type { ProjectDetails } from '../../enterprise/entities/value-objects/project-details.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'

interface GetProjectUseCaseRequest {
  projectId: string
}

type GetProjectUseCaseResponse = Either<ResourceNotFoundError, ProjectDetails>

export class GetProjectUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    projectId,
  }: GetProjectUseCaseRequest): Promise<GetProjectUseCaseResponse> {
    const project = await this.projectsRepository.findDetailsById(projectId)

    if (!project) {
      return left(new ResourceNotFoundError('Project not found.'))
    }

    return right(project)
  }
}
