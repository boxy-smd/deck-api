import type { Comment } from '@/@core/domain/interactions/entities/comment'
import type { CommentWithAuthor } from '@/@core/domain/interactions/value-objects/comment-with-author'
import type { DomainRepository } from '@/@shared/kernel/kernel/domain-repository'

export abstract class CommentsRepository implements DomainRepository<Comment> {
  abstract findById(id: string): Promise<Comment | null>

  abstract findAll(): Promise<Comment[]>

  abstract findByProjectId(projectId: string): Promise<Comment[]>

  abstract findManyByProjectIdWithAuthors(
    projectId: string,
  ): Promise<CommentWithAuthor[]>

  abstract deleteManyByProjectId(projectId: string): Promise<void>

  abstract create(entity: Comment): Promise<void>

  abstract save(entity: Comment): Promise<void>

  abstract delete(entity: Comment): Promise<void>

  abstract deleteById(id: string): Promise<void>

  abstract existsById(id: string): Promise<boolean>
}
