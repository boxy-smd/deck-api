import type { Post } from '../../../enterprise/value-objects/post'
import type { ProjectsRepository } from '../../repositories/projects-repository'
import type { SearchCriteria, SearchStrategy } from './search-strategy'

export class SearchAllStrategy implements SearchStrategy {
  canHandle(_criteria: SearchCriteria): boolean {
    return true
  }

  async search(
    _criteria: SearchCriteria,
    repository: ProjectsRepository,
  ): Promise<Post[]> {
    return repository.findAllPosts()
  }
}
