import type { Post } from '../../../enterprise/value-objects/post'
import type { ProjectsRepository } from '../../repositories/projects-repository'
import { SearchAllStrategy } from './search-all-strategy'
import { SearchByMetadataStrategy } from './search-by-metadata-strategy'
import { SearchByProfessorStrategy } from './search-by-professor-strategy'
import { SearchByQueryStrategy } from './search-by-query-strategy'
import { SearchByTagsStrategy } from './search-by-tags-strategy'
import { SearchByTitleStrategy } from './search-by-title-strategy'
import type { SearchCriteria, SearchStrategy } from './search-strategy'

export class SearchContext {
  private readonly strategies: SearchStrategy[]

  constructor() {
    this.strategies = [
      new SearchByTitleStrategy(),
      new SearchByProfessorStrategy(),
      new SearchByTagsStrategy(),
      new SearchByMetadataStrategy(),
      new SearchByQueryStrategy(),
      new SearchAllStrategy(),
    ]
  }

  async search(
    criteria: SearchCriteria,
    repository: ProjectsRepository,
  ): Promise<Post[]> {
    const strategy = this.strategies.find(s => s.canHandle(criteria))

    if (!strategy) {
      return []
    }

    return strategy.search(criteria, repository)
  }
}
