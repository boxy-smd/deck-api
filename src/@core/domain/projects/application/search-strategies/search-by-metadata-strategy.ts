import type { Post } from '../../../enterprise/value-objects/post'
import type { ProjectsRepository } from '../../repositories/projects-repository'
import type { SearchCriteria, SearchStrategy } from './search-strategy'

export class SearchByMetadataStrategy implements SearchStrategy {
  canHandle(criteria: SearchCriteria): boolean {
    return Boolean(
      criteria.trailsIds ||
        criteria.semester ||
        criteria.subjectId ||
        criteria.publishedYear,
    )
  }

  async search(
    criteria: SearchCriteria,
    repository: ProjectsRepository,
  ): Promise<Post[]> {
    return repository.findManyPostsByQuery({
      trailsIds: criteria.trailsIds,
      semester: criteria.semester,
      subjectId: criteria.subjectId,
      publishedYear: criteria.publishedYear,
    })
  }
}
