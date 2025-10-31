import type { ProjectDTO } from '../dtos/project.dto'
import { ProjectsRepository } from '../repositories/projects-repository'
import type { SearchCriteria, SearchStrategy } from './search-strategy'

export class SearchAllStrategy implements SearchStrategy {
  canHandle(_criteria: SearchCriteria): boolean {
    return true
  }

  search(
    _criteria: SearchCriteria,
    repository: ProjectsRepository,
  ): Promise<ProjectDTO[]> {
    return repository.findAllProjectDTOs()
  }
}
