import type { ProjectsRepository } from '../../../projects/application/repositories/projects-repository'
import type { Post } from '../../enterprise/entities/post'

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
