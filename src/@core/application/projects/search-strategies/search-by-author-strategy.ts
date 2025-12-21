import type { ProjectDTO } from '../dtos/project.dto'
import { ProjectsRepository } from '../repositories/projects-repository'
import type { SearchCriteria, SearchStrategy } from './search-strategy'

export class SearchByAuthorStrategy implements SearchStrategy {
  canHandle(criteria: SearchCriteria): boolean {
    return Boolean(criteria.authorId)
  }

  search(
    criteria: SearchCriteria,
    repository: ProjectsRepository,
  ): Promise<ProjectDTO[]> {
    if (!criteria.authorId) {
      return Promise.resolve([])
    }
    return repository.findManyProjectDTOsByStudentId(criteria.authorId)
  }
}
