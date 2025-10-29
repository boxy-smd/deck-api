import type { DomainRepository } from '@/shared/kernel/domain-repository'
import type { Comment } from '../../enterprise/entities/comment'
import type { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

export interface CommentsRepository extends DomainRepository<Comment> {
  findByProjectId(projectId: string): Promise<Comment[]>

  findManyByProjectIdWithAuthors(
    projectId: string,
  ): Promise<CommentWithAuthor[]>
  
  deleteManyByProjectId(projectId: string): Promise<void>
}
