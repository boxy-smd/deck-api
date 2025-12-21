import type { ProjectDTO } from '../dtos/project.dto'
import type { ProjectsRepository } from '../repositories/projects-repository'

export interface SearchCriteria {
  query?: string
  title?: string
  tags?: string[]
  professorName?: string
  trailsIds?: string[]
  subjectId?: string
  publishedYear?: number
  semester?: number
  authorId?: string
}

export interface SearchStrategy {
  canHandle(criteria: SearchCriteria): boolean
  search(
    criteria: SearchCriteria,
    repository: ProjectsRepository,
  ): Promise<ProjectDTO[]>
}
