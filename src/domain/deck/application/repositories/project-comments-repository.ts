import type { ProjectComment } from '../../enterprise/entities/project-comment.ts'

export interface ProjectCommentsRepository {
  findManyByProjectId(projectId: string): Promise<ProjectComment[]>
  create(projectComment: ProjectComment): Promise<void>
  delete(projectComment: ProjectComment): Promise<void>
  deleteMany(projectComments: ProjectComment[]): Promise<void>
}
