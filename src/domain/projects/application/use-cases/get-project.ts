import { type Either, left, right } from '@/shared/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error'
import type { Project } from '../../enterprise/entities/project'
import type { ProjectsRepository } from '../repositories/projects-repository'

interface GetProjectUseCaseRequest {
  projectId: string
}

type GetProjectUseCaseResponse = Either<ResourceNotFoundError, Project>

export class GetProjectUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    projectId,
  }: GetProjectUseCaseRequest): Promise<GetProjectUseCaseResponse> {
    const project = await this.projectsRepository.findById(projectId)

    if (!project) {
      return left(new ResourceNotFoundError('Project not found.'))
    }

    return right(project)
  }
}
