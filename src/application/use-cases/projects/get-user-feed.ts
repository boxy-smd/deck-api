import type { Project } from '@/domain/entities/project.entity.ts'
import type { ProjectsRepository } from '@/domain/repositories/projects-repository.ts'

interface GetUserFeedUseCaseRequest {
  semester: number
}

type GetUserFeedUseCaseResponse = Project[]

export class GetUserFeedUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    semester,
  }: GetUserFeedUseCaseRequest): Promise<GetUserFeedUseCaseResponse> {
    const projects = await this.projectsRepository.fetchBySemester(semester)

    return projects
  }
}
