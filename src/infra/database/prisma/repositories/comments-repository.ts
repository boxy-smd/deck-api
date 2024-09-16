import type { CommentsRepository } from '@/domain/deck/application/repositories/comments-repository.ts'
import type { Comment } from '@/domain/deck/enterprise/entities/comment.ts'
import type { CommentWithAuthor } from '@/domain/deck/enterprise/entities/value-objects/comment-with-author.ts'
import { prisma } from '../client.ts'
import { PrismaCommentMapper } from '../mappers/prisma-comment-mapper.ts'
import type { PrismaReportsRepository } from './reports-repository.ts'

export class PrismaCommentsRepository implements CommentsRepository {
  constructor(private readonly reportsRepository: PrismaReportsRepository) {}

  async findById(id: string): Promise<Comment | null> {
    const data = await prisma.comment.findUnique({
      where: {
        id,
      },
    })

    if (!data) return null

    return PrismaCommentMapper.toEntity(data)
  }

  async findByProjectId(projectId: string): Promise<Comment[]> {
    const data = await prisma.comment.findMany({
      where: {
        projectId,
      },
    })

    return data.map(PrismaCommentMapper.toEntity)
  }

  async findManyByProjectIdWithAuthors(
    projectId: string,
  ): Promise<CommentWithAuthor[]> {
    const data = await prisma.comment.findMany({
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

    return data.map(PrismaCommentMapper.toEntityWithAuthor)
  }

  async create(comment: Comment): Promise<void> {
    const data = PrismaCommentMapper.toPrisma(comment)

    await prisma.comment.create({
      data,
    })
  }

  async save(comment: Comment): Promise<void> {
    const data = PrismaCommentMapper.toPrisma(comment)

    await prisma.comment.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    this.reportsRepository.deleteManyByCommentId(id)

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
