import { WatchedList } from '@/core/entities/watched-list.ts'
import type { ProjectTrail } from './project-trail.ts'

export class ProjectTrailList extends WatchedList<ProjectTrail> {
  public compareItems(a: ProjectTrail, b: ProjectTrail): boolean {
    return a.trailId === b.trailId
  }
}
