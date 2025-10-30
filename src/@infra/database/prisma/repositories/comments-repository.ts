import type { CommentsRepository } from '@/@core/domain/interaction/application/repositories/comments-repository'
import type { Comment } from '@/@core/domain/interaction/enterprise/entities/comment'
import type { CommentWithAuthor } from '@/@core/domain/interaction/enterprise/entities/value-objects/comment-with-author'
import { Injectable } from '@nestjs/common'
import { PrismaErrorHandler } from '../error-handler'
import { PrismaCommentMapper } from '../mappers/prisma-comment-mapper'
import type { PrismaService } from '../prisma.service'
import type { PrismaReportsRepository } from './reports-repository'

@Injectable()
export class PrismaCommentsRepository implements CommentsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reportsRepository: PrismaReportsRepository,
  ) {}

  async findById(id: string): Promise<Comment | null> {
    const data = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    })

    if (!data) return null

    return PrismaCommentMapper.toEntity(data)
  }

  async findByProjectId(projectId: string): Promise<Comment[]> {
    const data = await this.prisma.comment.findMany({
      where: {
        projectId,
      },
    })

    return data.map(PrismaCommentMapper.toEntity)
  }

  async findManyByProjectIdWithAuthors(
    projectId: string,
  ): Promise<CommentWithAuthor[]> {
    const data = await this.prisma.comment.findMany({
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

  async findAll(): Promise<Comment[]> {
    const data = await this.prisma.comment.findMany()

    return data.map(PrismaCommentMapper.toEntity)
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.comment.count({
      where: {
        id,
      },
    })

    return count > 0
  }

  async create(comment: Comment): Promise<void> {
    const data = PrismaCommentMapper.toPrisma(comment)

    await this.prisma.comment.create({
      data,
    })
  }

  async save(comment: Comment): Promise<void> {
    const data = PrismaCommentMapper.toPrisma(comment)

    await this.prisma.comment.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(comment: Comment): Promise<void> {
    await PrismaErrorHandler.execute(async () => {
      await this.prisma.$transaction(async tx => {
        await tx.report.deleteMany({
          where: { commentId: comment.id.toString() },
        })

        await tx.comment.delete({
          where: { id: comment.id.toString() },
        })
      })
    })
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id,
      },
    })
  }

  async deleteManyByProjectId(projectId: string): Promise<void> {
    await this.prisma.comment.deleteMany({
      where: {
        projectId,
      },
    })
  }
}
