import type { Project } from '../../enterprise/entities/project.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'

interface FilterPostsByQueryUseCaseRequest {
  trailsIds?: string[]
  semester?: number
  subjectId?: string
  publishedYear?: number
}

type FilterPostsByQueryUseCaseResponse = Project[]

export class FilterPostsByQueryUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    trailsIds,
    semester,
    subjectId,
    publishedYear,
  }: FilterPostsByQueryUseCaseRequest): Promise<FilterPostsByQueryUseCaseResponse> {
    return await this.projectsRepository.findManyByQuery({
      trailsIds,
      semester,
      subjectId,
      publishedYear,
    })
  }
}
