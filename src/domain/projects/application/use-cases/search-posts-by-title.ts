import type { ProjectsRepository } from '../../../projects/application/repositories/projects-repository.ts'
import type { Post } from '../../enterprise/value-objects/post.ts'

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
