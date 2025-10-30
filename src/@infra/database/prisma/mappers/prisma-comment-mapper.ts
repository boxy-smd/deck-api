import type { Comment as CommentRaw, Prisma } from '@prisma/client'

import { Comment } from '@/@core/domain/interactions/entities/comment'
import { CommentWithAuthor } from '@/@core/domain/interactions/value-objects/comment-with-author'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import type { PrismaCommentWithAuthor } from '../types/prisma-types'

export class PrismaCommentMapper {
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

  static toEntityWithAuthor(raw: PrismaCommentWithAuthor): CommentWithAuthor {
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

  static toPrisma(comment: Comment): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      content: comment.content,
      authorId: comment.authorId.toString(),
      projectId: comment.projectId.toString(),
    }
  }
}
