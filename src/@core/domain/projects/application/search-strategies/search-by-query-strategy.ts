import type { ProjectDTO } from '../../dtos/project.dto'
import type { ProjectsRepository } from '../../repositories/projects-repository'
import type { SearchCriteria, SearchStrategy } from './search-strategy'

export class SearchByQueryStrategy implements SearchStrategy {
  canHandle(criteria: SearchCriteria): boolean {
    return Boolean(criteria.query)
  }

  async search(
    criteria: SearchCriteria,
    repository: ProjectsRepository,
  ): Promise<ProjectDTO[]> {
    if (!criteria.query) return []
    return repository.findManyProjectDTOsByTitle(criteria.query)
  }
}
