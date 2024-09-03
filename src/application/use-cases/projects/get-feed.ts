import type { Project } from '@/domain/entities/project.entity.ts'
import type { ProjectsRepository } from '@/domain/repositories/projects-repository.ts'

type GetFeedUseCaseResponse = Project[]

export class GetFeedUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute(): Promise<GetFeedUseCaseResponse> {
    const projects = await this.projectsRepository.fetch()

    return projects
  }
}
