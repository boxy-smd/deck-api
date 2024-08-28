import type { Repository } from '@/domain/core/interfaces/repository.ts'
import type { Project, ProjectProps } from '@/domain/entities/project.entity.ts'

export type UpdateProjectRequest = Partial<
  Omit<ProjectProps, 'createdAt' | 'updatedAt' | 'authorId'>
>

export type ProjectQuery = {
  name?: string
  authorId?: string
  subjectId?: string
  professorsIds?: string[]
  publishedYear?: number
}

export interface ProjectsRepository
  extends Repository<Project, UpdateProjectRequest> {
  fetchByQuery(query: ProjectQuery): Promise<Project[]>
}
