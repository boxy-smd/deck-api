import { CommentsRepository } from '@/@core/application/interactions/repositories/comments-repository'
import { Comment } from '@/@core/domain/interactions/entities/comment'
import { CommentWithAuthor } from '@/@core/domain/interactions/value-objects/comment-with-author'
import { Inject, Injectable } from '@nestjs/common'
import { desc, eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DRIZZLE } from '../drizzle.provider'
import { DrizzleCommentMapper } from '../mappers/drizzle-comment-mapper'
import * as schema from '../schema'
import { comments } from '../schema'

@Injectable()
export class DrizzleCommentsRepository implements CommentsRepository {
  constructor(
    @Inject(DRIZZLE) private drizzle: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: string): Promise<Comment | null> {
    const result = await this.drizzle.query.comments.findFirst({
      where: eq(comments.id, id),
    })

    if (!result) return null

    return DrizzleCommentMapper.toEntity(result)
  }

  async findAll(): Promise<Comment[]> {
    const results = await this.drizzle.query.comments.findMany({
      orderBy: desc(comments.createdAt),
    })

    return results.map(DrizzleCommentMapper.toEntity)
  }

  async findByProjectId(projectId: string): Promise<Comment[]> {
    const results = await this.drizzle.query.comments.findMany({
      where: eq(comments.projectId, projectId),
      orderBy: desc(comments.createdAt),
    })

    return results.map(DrizzleCommentMapper.toEntity)
  }

  async findManyByProjectIdWithAuthors(
    projectId: string,
  ): Promise<CommentWithAuthor[]> {
    const results = await this.drizzle.query.comments.findMany({
      where: eq(comments.projectId, projectId),
      with: {
        author: true,
      },
      orderBy: desc(comments.createdAt),
    })

    return results.map(DrizzleCommentMapper.toEntityWithAuthor)
  }

  async deleteManyByProjectId(projectId: string): Promise<void> {
    await this.drizzle.delete(comments).where(eq(comments.projectId, projectId))
  }

  async create(entity: Comment): Promise<void> {
    await this.drizzle.insert(comments).values({
      id: entity.id.toString(),
      content: entity.content,
      authorId: entity.authorId.toString(),
      projectId: entity.projectId.toString(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt ?? null,
    })
  }

  async save(entity: Comment): Promise<void> {
    await this.drizzle
      .update(comments)
      .set({
        content: entity.content,
        updatedAt: new Date(),
      })
      .where(eq(comments.id, entity.id.toString()))
  }

  async delete(entity: Comment): Promise<void> {
    await this.deleteById(entity.id.toString())
  }

  async deleteById(id: string): Promise<void> {
    await this.drizzle.delete(comments).where(eq(comments.id, id))
  }

  async existsById(id: string): Promise<boolean> {
    const result = await this.drizzle.query.comments.findFirst({
      where: eq(comments.id, id),
      columns: { id: true },
    })
    return !!result
  }
}
