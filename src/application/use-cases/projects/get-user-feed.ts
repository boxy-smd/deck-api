import type { ProjectsRepository } from '@/domain/deck/application/repositories/projects-repository.ts'
import type { Project } from '@/domain/deck/enterprise/entities/project.entity.ts'

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
