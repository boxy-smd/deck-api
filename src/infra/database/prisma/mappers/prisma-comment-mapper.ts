import type { Comment as CommentRaw, Prisma } from '@prisma/client'

import { Comment } from '@/domain/interaction/enterprise/entities/comment.ts'
import { CommentWithAuthor } from '@/domain/interaction/enterprise/entities/value-objects/comment-with-author.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a mapper and should have only static methods
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

  static toEntityWithAuthor(
    raw: CommentRaw & {
      author: {
        name: string
        username: string
        profileUrl: string | null
      }
    },
  ): CommentWithAuthor {
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
