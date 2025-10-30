import { type Either, left, right } from '@/@shared/kernel/either'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { Injectable } from '@nestjs/common'
import type { Project } from '../../enterprise/entities/project'
import type { ProjectsRepository } from '../repositories/projects-repository'

interface GetProjectUseCaseRequest {
  projectId: string
}

type GetProjectUseCaseResponse = Either<ResourceNotFoundError, Project>

@Injectable()
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
