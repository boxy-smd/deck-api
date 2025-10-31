import type { ProjectDTO } from '../dtos/project.dto'
import { ProjectsRepository } from '../repositories/projects-repository'
import type { SearchCriteria, SearchStrategy } from './search-strategy'

export class SearchByTitleStrategy implements SearchStrategy {
  canHandle(criteria: SearchCriteria): boolean {
    return Boolean(criteria.title)
  }

  search(
    criteria: SearchCriteria,
    repository: ProjectsRepository,
  ): Promise<ProjectDTO[]> {
    if (!criteria.title) return Promise.resolve([])
    return repository.findManyProjectDTOsByTitle(criteria.title)
  }
}
