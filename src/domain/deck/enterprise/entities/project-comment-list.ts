import { WatchedList } from '@/core/entities/watched-list.ts'
import type { ProjectComment } from './project-comment.ts'

export class ProjectCommentList extends WatchedList<ProjectComment> {
  public compareItems(a: ProjectComment, b: ProjectComment): boolean {
    return a.commentId === b.commentId
  }
}
