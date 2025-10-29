import type { Post } from '../../../enterprise/value-objects/post'
import type { ProjectsRepository } from '../../repositories/projects-repository'
import type { SearchCriteria, SearchStrategy } from './search-strategy'

export class SearchByTagsStrategy implements SearchStrategy {
  canHandle(criteria: SearchCriteria): boolean {
    return Boolean(criteria.tags && criteria.tags.length > 0)
  }

  async search(
    criteria: SearchCriteria,
    repository: ProjectsRepository,
  ): Promise<Post[]> {
    if (!criteria.tags || criteria.tags.length === 0) return []

    const allProjects = await Promise.all(
      criteria.tags.map(tag => repository.findManyPostsByTag(tag)),
    )

    const projectsMap = new Map<string, Post>()
    for (const projectList of allProjects) {
      for (const project of projectList) {
        projectsMap.set(project.id.toString(), project)
      }
    }

    return Array.from(projectsMap.values())
  }
}
