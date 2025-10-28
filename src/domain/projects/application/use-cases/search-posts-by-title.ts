import type { ProjectsRepository } from '../../../projects/application/repositories/projects-repository.ts'
import type { Project } from '../../enterprise/entities/project.ts'

interface SearchPostsByTitleUseCaseRequest {
  title: string
}

type SearchPostsByTitleUseCaseResponse = Project[]

export class SearchPostsByTitleUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    title,
  }: SearchPostsByTitleUseCaseRequest): Promise<SearchPostsByTitleUseCaseResponse> {
    return await this.projectsRepository.findManyByTitle(title)
  }
}
