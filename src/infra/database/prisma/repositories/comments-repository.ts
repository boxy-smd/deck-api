import type { Comment } from '@/domain/deck/enterprise/entities/comment.entity.ts'
import type {
  CommentsRepository,
  UpdateCommentRequest,
} from '@/domain/repositories/comments-repository.ts'
import { prisma } from '../client.ts'
import { CommentMapper } from '../mappers/comment-mapper.ts'

export class PrismaCommentsRepository implements CommentsRepository {
  async create(comment: Comment): Promise<Comment> {
    const raw = CommentMapper.toPersistence(comment)
    const createdRaw = await prisma.comment.create({ data: raw })
    return CommentMapper.toDomain(createdRaw)
  }

  async findById(id: string): Promise<Comment | null> {
    const raw = await prisma.comment.findUnique({ where: { id } })
    return raw ? CommentMapper.toDomain(raw) : null
  }

  async fetchByProjectId(projectId: string): Promise<Comment[]> {
    const comments = await prisma.comment.findMany({ where: { projectId } })
    return comments.map(comment => CommentMapper.toDomain(comment))
  }

  async update(
    id: string,
    request: UpdateCommentRequest,
  ): Promise<Comment | null> {
    const raw = CommentMapper.toPersistenceUpdate(request)
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: raw,
    })
    return CommentMapper.toDomain(updatedComment)
  }

  async delete(id: string): Promise<void> {
    await prisma.comment.delete({ where: { id } })
  }
}
