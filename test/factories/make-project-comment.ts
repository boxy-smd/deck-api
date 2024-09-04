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
      content: 'Great job!',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: new UniqueEntityID(),
      projectId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return projectComment
}
