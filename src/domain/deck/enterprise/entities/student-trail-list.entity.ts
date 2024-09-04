import { WatchedList } from '@/core/entities/watched-list.ts'
import type { StudentTrail } from './student-trail.entity.ts'

export class StudentTrailList extends WatchedList<StudentTrail> {
  public compareItems(a: StudentTrail, b: StudentTrail): boolean {
    return a.trailId === b.trailId
  }
}
