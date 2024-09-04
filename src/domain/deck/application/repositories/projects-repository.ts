import type {
  Project,
  ProjectProps,
} from '@/domain/deck/enterprise/entities/project.ts'
import type { ProjectDetails } from '../../enterprise/entities/value-objects/project-details.ts'

export type ProjectQuery = {
  title?: string
  authorId?: string
  subjectId?: string
  professorsIds?: string[]
  publishedYear?: number
}

export interface ProjectsRepository {
  findById(id: string): Promise<Project | null>
  findDetailsById(id: string): Promise<ProjectDetails | null>
  fetchAll(): Promise<Project[]>
  fetchByQuery(query: ProjectQuery): Promise<Project[]>
  create(project: ProjectProps): Promise<void>
  save(project: Project): Promise<void>
  delete(project: Project): Promise<void>
}
