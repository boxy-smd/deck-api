import type { Repository } from '@/domain/core/interfaces/repository.ts'
import type { Project, ProjectProps } from '@/domain/entities/project.entity.ts'

export type UpdateProjectRequest = Partial<
  Pick<
    ProjectProps,
    | 'title'
    | 'description'
    | 'bannerUrl'
    | 'content'
    | 'publishedYear'
    | 'status'
    | 'semester'
    | 'allowComments'
    | 'subjectId'
    | 'trails'
    | 'professors'
  >
>

export type ProjectQuery = {
  title?: string
  authorId?: string
  subjectId?: string
  professorsIds?: string[]
  publishedYear?: number
}

export interface ProjectsRepository
  extends Repository<Project, UpdateProjectRequest> {
  fetchByQuery(query: ProjectQuery): Promise<Project[]>
}
