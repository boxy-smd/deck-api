import type { Prisma, Comment as RawComment } from '@prisma/client'

import type { UpdateCommentRequest } from '@/application/repositories/comments-repository.ts'
import { Comment } from '@/domain/entities/comment.entity.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CommentMapper {
  static toDomain(raw: RawComment): Comment {
    const comment = Comment.create(
      {
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        authorId: raw.authorId,
        projectId: raw.projectId,
      },
      raw.id,
    )

    return comment
  }

  static toPersistence(comment: Comment): Prisma.CommentCreateInput {
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: {
        connect: { id: comment.authorId },
      },
      project: {
        connect: { id: comment.projectId },
      },
    }
  }

  static toPersistenceUpdate(
    comment: UpdateCommentRequest,
  ): Prisma.CommentUpdateInput {
    const raw: Prisma.CommentUpdateInput = {
      content: comment.content,
      updatedAt: new Date(),
    }

    return raw
  }
}
