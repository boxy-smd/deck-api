import type {
  Comment,
  CommentProps,
} from '@/domain/deck/enterprise/entities/comment.ts'

export interface CommentsRepository {
  create(comment: CommentProps): Promise<void>
  save(comment: Comment): Promise<void>
  delete(comment: Comment): Promise<void>
}
