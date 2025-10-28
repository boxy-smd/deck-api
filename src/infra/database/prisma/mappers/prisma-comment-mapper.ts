import type { Comment as CommentRaw, Prisma } from '@prisma/client'

import { Comment } from '@/domain/interaction/enterprise/entities/comment.ts'
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

  static toPrisma(comment: Comment): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      content: comment.content,
      authorId: comment.authorId.toString(),
      projectId: comment.projectId.toString(),
    }
  }
}
