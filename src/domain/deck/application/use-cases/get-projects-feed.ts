import type { ProjectDetails } from '../../enterprise/entities/value-objects/project-details.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'

type GetProjectFeedUseCaseResponse = ProjectDetails[]

export class GetProjectsFeedUseCase {
  constructor(private projectsRepository: ProjectsRepository) {}

  async execute(): Promise<GetProjectFeedUseCaseResponse> {
    return await this.projectsRepository.findAllDetails()
  }
}
