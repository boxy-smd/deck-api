import {
  Comment,
  type CommentProps,
} from '@/domain/interaction/enterprise/entities/comment'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id'

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
