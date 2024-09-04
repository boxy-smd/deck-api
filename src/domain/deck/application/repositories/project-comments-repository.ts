import type { ProjectComment } from '../../enterprise/entities/project-comment.ts'
import type { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-autor.ts'

export interface ProjectCommentsRepository {
  findById(id: string): Promise<ProjectComment | null>
  findManyByProjectIdWitAuthor(projectId: string): Promise<CommentWithAuthor[]>
  create(projectComment: ProjectComment): Promise<void>
  delete(projectComment: ProjectComment): Promise<void>
  deleteMany(projectComments: ProjectComment[]): Promise<void>
}
