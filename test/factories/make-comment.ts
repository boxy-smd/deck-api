import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import {
  Comment,
  type CommentProps,
} from '@/domain/deck/enterprise/entities/comment.ts'

export function makeComment(
  override: Partial<CommentProps> = {},
  id?: UniqueEntityID,
) {
  const comment = Comment.create(
    {
      content: 'Great project!',
      authorId: new UniqueEntityID(),
      projectId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return comment
}
