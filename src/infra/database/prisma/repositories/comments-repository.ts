import type { CommentsRepository } from '@/domain/deck/application/repositories/comments-repository.ts'
import type { Comment } from '@/domain/deck/enterprise/entities/comment.ts'
import type { CommentWithAuthor } from '@/domain/deck/enterprise/entities/value-objects/comment-with-author.ts'
import { prisma } from '../client.ts'
import { PrismaCommentMapper } from '../mappers/prisma-comment-mapper.ts'

export class PrismaCommentsRepository implements CommentsRepository {
  async findById(id: string): Promise<Comment | null> {
    const raw = await prisma.comment.findUnique({
      where: {
        id,
      },
    })

    if (!raw) return null

    return PrismaCommentMapper.toEntity(raw)
  }

  async findByProjectId(projectId: string): Promise<Comment[]> {
    const raw = await prisma.comment.findMany({
      where: {
        projectId,
      },
    })

    return raw.map(PrismaCommentMapper.toEntity)
  }

  async findManyByProjectIdWithAuthors(
    projectId: string,
  ): Promise<CommentWithAuthor[]> {
    const raw = await prisma.comment.findMany({
      where: {
        projectId,
      },
      include: {
        author: {
          select: {
            name: true,
            username: true,
            profileUrl: true,
          },
        },
      },
    })

    return raw.map(PrismaCommentMapper.toEntityWithAuthor)
  }

  async create(comment: Comment): Promise<void> {
    const raw = PrismaCommentMapper.toPrisma(comment)

    await prisma.comment.create({
      data: raw,
    })
  }

  async save(comment: Comment): Promise<void> {
    const raw = PrismaCommentMapper.toPrisma(comment)

    await prisma.comment.update({
      where: {
        id: raw.id,
      },
      data: raw,
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.comment.delete({
      where: {
        id,
      },
    })
  }

  async deleteManyByProjectId(projectId: string): Promise<void> {
    await prisma.comment.deleteMany({
      where: {
        projectId,
      },
    })
  }
}
