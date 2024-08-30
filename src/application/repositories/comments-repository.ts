import type { Repository } from '@/domain/core/interfaces/repository.ts'
import type { Comment, CommentProps } from '@/domain/entities/comment.entity.ts'

export type UpdateCommentRequest = Partial<Pick<CommentProps, 'content'>>

export interface CommentsRepository
  extends Repository<Comment, UpdateCommentRequest> {
  fetchByProjectId(projectId: string): Promise<Comment[]>
}
