import { type Either, left, right } from '@/@shared/kernel/either'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { Injectable } from '@nestjs/common'
import type { ProjectDTO } from '../dtos/project.dto'
import type { ProjectsRepository } from '../repositories/projects-repository'

interface GetProjectUseCaseRequest {
  projectId: string
}

type GetProjectUseCaseResponse = Either<ResourceNotFoundError, ProjectDTO>

@Injectable()
export class GetProjectUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    projectId,
  }: GetProjectUseCaseRequest): Promise<GetProjectUseCaseResponse> {
    const projectDTO = await this.projectsRepository.findByIdWithDetails(projectId)

    if (!projectDTO) {
      return left(new ResourceNotFoundError('Project not found.'))
    }

    return right(projectDTO)
  }
}
