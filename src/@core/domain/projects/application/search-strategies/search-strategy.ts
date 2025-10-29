import type { Post } from '../../../enterprise/value-objects/post'
import type { ProjectsRepository } from '../../repositories/projects-repository'

export interface SearchCriteria {
  query?: string
  title?: string
  tags?: string[]
  professorName?: string
  trailsIds?: string[]
  subjectId?: string
  publishedYear?: number
  semester?: number
}

export interface SearchStrategy {
  canHandle(criteria: SearchCriteria): boolean
  search(
    criteria: SearchCriteria,
    repository: ProjectsRepository,
  ): Promise<Post[]>
}
