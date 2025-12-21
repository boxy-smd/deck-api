import type { ProjectDTO } from '../dtos/project.dto'
import { ProjectsRepository } from '../repositories/projects-repository'
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

  search(
    criteria: SearchCriteria,
    repository: ProjectsRepository,
  ): Promise<ProjectDTO[]> {
    return repository.findManyProjectDTOsByQuery({
      trailsIds: criteria.trailsIds,
      semester: criteria.semester,
      subjectId: criteria.subjectId,
      publishedYear: criteria.publishedYear,
    })
  }
}
