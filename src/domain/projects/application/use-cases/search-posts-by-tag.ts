import type { ProjectsRepository } from '../../../projects/application/repositories/projects-repository.ts'
import type { Project } from '../../enterprise/entities/project.ts'

interface SearchPostsByTagUseCaseRequest {
  tag: string
}

type SearchPostsByTagUseCaseResponse = Project[]

export class SearchPostsByTagUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    tag,
  }: SearchPostsByTagUseCaseRequest): Promise<SearchPostsByTagUseCaseResponse> {
    return await this.projectsRepository.findManyByTag(tag)
  }
}
