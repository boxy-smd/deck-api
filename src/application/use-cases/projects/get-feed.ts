import type { ProjectsRepository } from '@/application/repositories/projects-repository.ts'
import type { Project } from '@/domain/entities/project.entity.ts'

type GetFeedUseCaseResponse = Project[]

export class GetFeedUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute(): Promise<GetFeedUseCaseResponse> {
    const projects = await this.projectsRepository.fetch()

    return projects
  }
}
