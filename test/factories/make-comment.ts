import {
  Comment,
  type CommentProps,
} from '@/domain/interaction/enterprise/entities/comment.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'

export function makeComment(
  override: Partial<CommentProps> = {},
  id?: UniqueEntityID,
) {
  const comment = Comment.create(
    {
      content: 'Ótimo projeto!',
      authorId: new UniqueEntityID(),
      projectId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return comment
}
