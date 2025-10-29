import type { Post } from '../../../enterprise/value-objects/post'
import type { ProjectsRepository } from '../../repositories/projects-repository'
import type { SearchCriteria, SearchStrategy } from './search-strategy'

export class SearchByQueryStrategy implements SearchStrategy {
  canHandle(criteria: SearchCriteria): boolean {
    return Boolean(criteria.query)
  }

  async search(
    criteria: SearchCriteria,
    repository: ProjectsRepository,
  ): Promise<Post[]> {
    if (!criteria.query) return []
    return repository.findManyPostsByTitle(criteria.query)
  }
}
