import type { Comment } from '../../enterprise/entities/comment.ts'
import type { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author.ts'

export interface CommentsRepository {
  findById(id: string): Promise<Comment | null>
  findManyByProjectIdWithAuthors(
    projectId: string,
  ): Promise<CommentWithAuthor[]>
  create(comment: Comment): Promise<void>
  save(comment: Comment): Promise<void>
  delete(id: string): Promise<void>
  deleteManyByProjectId(projectId: string): Promise<void>
}
