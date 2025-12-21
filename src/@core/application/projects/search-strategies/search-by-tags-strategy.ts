import type { ProjectDTO } from '../dtos/project.dto'
import { ProjectsRepository } from '../repositories/projects-repository'
import type { SearchCriteria, SearchStrategy } from './search-strategy'

export class SearchByTagsStrategy implements SearchStrategy {
  canHandle(criteria: SearchCriteria): boolean {
    return Boolean(criteria.tags && criteria.tags.length > 0)
  }

  async search(
    criteria: SearchCriteria,
    repository: ProjectsRepository,
  ): Promise<ProjectDTO[]> {
    if (!criteria.tags || criteria.tags.length === 0) return []

    const allProjects = await Promise.all(
      criteria.tags.map(tag => repository.findManyProjectDTOsByTag(tag)),
    )

    const projectsMap = new Map<string, ProjectDTO>()
    for (const projectList of allProjects) {
      for (const project of projectList) {
        projectsMap.set(project.id, project)
      }
    }

    return Array.from(projectsMap.values())
  }
}
