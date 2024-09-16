import type { Post } from '../../enterprise/entities/value-objects/post.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'

interface SearchPostsByTagUseCaseRequest {
  tag: string
}

type SearchPostsByTagUseCaseResponse = Post[]

export class SearchPostsByTagUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    tag,
  }: SearchPostsByTagUseCaseRequest): Promise<SearchPostsByTagUseCaseResponse> {
    return await this.projectsRepository.findManyPostsByTag(tag)
  }
}
