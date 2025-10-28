import type { DomainRepository } from '@/shared/kernel/domain-repository.ts'
import type { Comment } from '../../enterprise/entities/comment.ts'
import type { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author.ts'

export interface CommentsRepository extends DomainRepository<Comment> {
  findByProjectId(projectId: string): Promise<Comment[]>

  findManyByProjectIdWithAuthors(
    projectId: string,
  ): Promise<CommentWithAuthor[]>
  
  deleteManyByProjectId(projectId: string): Promise<void>
}
