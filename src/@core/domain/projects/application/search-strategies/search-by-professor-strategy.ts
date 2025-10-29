import type { Post } from '../../../enterprise/value-objects/post'
import type { ProjectsRepository } from '../../repositories/projects-repository'
import type { SearchCriteria, SearchStrategy } from './search-strategy'

export class SearchByProfessorStrategy implements SearchStrategy {
  canHandle(criteria: SearchCriteria): boolean {
    return Boolean(criteria.professorName)
  }

  async search(
    criteria: SearchCriteria,
    repository: ProjectsRepository,
  ): Promise<Post[]> {
    if (!criteria.professorName) return []
    return repository.findManyPostsByProfessorName(criteria.professorName)
  }
}
