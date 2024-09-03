import type { Comment, CommentProps } from '@/domain/deck/enterprise/entities/comment.entity.ts'

export interface CommentsRepository {
  findById(id: string): Promise<Comment | null>
  create(comment: CommentProps): Promise<void>
  save(comment: Comment): Promise<void>
  delete(comment: Comment): Promise<void>
}
