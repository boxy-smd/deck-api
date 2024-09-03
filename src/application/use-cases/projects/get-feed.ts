import type { ProjectsRepository } from '@/domain/deck/application/repositories/projects-repository.ts'
import type { Project } from '@/domain/deck/enterprise/entities/project.entity.ts'

type GetFeedUseCaseResponse = Project[]

export class GetFeedUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute(): Promise<GetFeedUseCaseResponse> {
    const projects = await this.projectsRepository.fetch()

    return projects
  }
}
