import type { Post } from '../../enterprise/value-objects/post'
import type { ProjectsRepository } from '../repositories/projects-repository'

interface FilterPostsByQueryUseCaseRequest {
  trailsIds?: string[]
  semester?: number
  subjectId?: string
  publishedYear?: number
}

type FilterPostsByQueryUseCaseResponse = Post[]

export class FilterPostsByQueryUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    trailsIds,
    semester,
    subjectId,
    publishedYear,
  }: FilterPostsByQueryUseCaseRequest): Promise<FilterPostsByQueryUseCaseResponse> {
    return await this.projectsRepository.findManyPostsByQuery({
      trailsIds,
      semester,
      subjectId,
      publishedYear,
    })
  }
}
