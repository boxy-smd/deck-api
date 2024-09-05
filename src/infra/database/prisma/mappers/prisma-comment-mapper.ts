import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { Comment } from '@/domain/deck/enterprise/entities/comment.ts'
import { CommentWithAuthor } from '@/domain/deck/enterprise/entities/value-objects/comment-with-author.ts'
import type { Comment as CommentRaw, Prisma } from '@prisma/client'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a mapper and should have only static methods
export class PrismaCommentMapper {
  static toEntity(raw: CommentRaw): Comment {
    return Comment.create(
      {
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        authorId: new UniqueEntityID(raw.authorId),
        projectId: new UniqueEntityID(raw.projectId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toEntityWithAuthor(
    raw: CommentRaw & {
      author: {
        name: string
        username: string
        profileUrl?: string | null
      }
    },
  ): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityID(raw.id),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      author: {
        name: raw.author.name,
        username: raw.author.username,
        profileUrl: raw.author.profileUrl ?? undefined,
      },
      authorId: new UniqueEntityID(raw.authorId),
    })
  }

  static toPrisma(comment: Comment): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt ?? undefined,
      authorId: comment.authorId.toString(),
      projectId: comment.projectId.toString(),
    }
  }
}
