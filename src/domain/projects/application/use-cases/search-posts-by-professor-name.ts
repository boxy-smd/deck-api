import type { ProjectsRepository } from '../../../projects/application/repositories/projects-repository.ts'
import type { Project } from '../../enterprise/entities/project.ts'

interface SearchPostsByProfessorUseCaseRequest {
  name: string
}

type SearchPostsByProfessorUseCaseResponse = Project[]

export class SearchPostsByProfessorUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    name,
  }: SearchPostsByProfessorUseCaseRequest): Promise<SearchPostsByProfessorUseCaseResponse> {
    return await this.projectsRepository.findManyByProfessorName(name)
  }
}
