import type { Post } from '../../enterprise/entities/value-objects/post.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'

interface SearchPostsByTitleUseCaseRequest {
  title: string
}

type SearchPostsByTitleUseCaseResponse = Post[]

export class SearchPostsByTitleUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    title,
  }: SearchPostsByTitleUseCaseRequest): Promise<SearchPostsByTitleUseCaseResponse> {
    return await this.projectsRepository.findManyPostsByTitle(title)
  }
}
