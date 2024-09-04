import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import {
  ProjectComment,
  type ProjectCommentProps,
} from '@/domain/deck/enterprise/entities/project-comment.ts'

export function makeProjectComment(
  override: Partial<ProjectCommentProps> = {},
  id?: UniqueEntityID,
) {
  const projectComment = ProjectComment.create(
    {
      projectId: new UniqueEntityID(),
      commentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return projectComment
}
