import type { Post } from '../../enterprise/entities/value-objects/post.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'

interface SearchPostsByProfessorUseCaseRequest {
  name: string
}

type SearchPostsByProfessorUseCaseResponse = Post[]

export class SearchPostsByProfessorUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    name,
  }: SearchPostsByProfessorUseCaseRequest): Promise<SearchPostsByProfessorUseCaseResponse> {
    return await this.projectsRepository.findManyPostsByProfessorName(name)
  }
}
