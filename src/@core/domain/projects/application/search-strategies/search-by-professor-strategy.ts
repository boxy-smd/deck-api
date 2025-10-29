import type { ProjectDTO } from '../dtos/project.dto'
import type { ProjectsRepository } from '../repositories/projects-repository'
import type { SearchCriteria, SearchStrategy } from './search-strategy'

export class SearchByProfessorStrategy implements SearchStrategy {
  canHandle(criteria: SearchCriteria): boolean {
    return Boolean(criteria.professorName)
  }

  search(
    criteria: SearchCriteria,
    repository: ProjectsRepository,
  ): Promise<ProjectDTO[]> {
    if (!criteria.professorName) return Promise.resolve([])
    return repository.findManyProjectDTOsByProfessorName(criteria.professorName)
  }
}
