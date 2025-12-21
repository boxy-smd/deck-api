import { InferSelectModel } from 'drizzle-orm'
import { Comment } from '@/@core/domain/interactions/entities/comment'
import { CommentWithAuthor } from '@/@core/domain/interactions/value-objects/comment-with-author'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { comments, users } from '../schema'

type CommentRaw = InferSelectModel<typeof comments>
type UserRaw = InferSelectModel<typeof users>

export type DrizzleCommentWithAuthor = CommentRaw & {
  author: UserRaw
}

export class DrizzleCommentMapper {
  static toEntity(raw: CommentRaw): Comment {
    return Comment.create(
      {
        content: raw.content,
        authorId: UniqueEntityID.create(raw.authorId),
        projectId: UniqueEntityID.create(raw.projectId),
      },
      UniqueEntityID.create(raw.id),
    )
  }

  static toEntityWithAuthor(raw: DrizzleCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: UniqueEntityID.create(raw.id),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      authorId: UniqueEntityID.create(raw.authorId),
      authorName: raw.author.name,
      authorUsername: raw.author.username,
      authorProfileUrl: raw.author.profileUrl,
      projectId: UniqueEntityID.create(raw.projectId),
    })
  }
}
