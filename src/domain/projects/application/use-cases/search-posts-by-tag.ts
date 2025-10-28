import type { ProjectsRepository } from '../../../projects/application/repositories/projects-repository.ts'
import type { Post } from '../../enterprise/value-objects/post.ts'

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
