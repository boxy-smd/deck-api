import type {
  Project,
  ProjectProps,
} from '@/domain/deck/enterprise/entities/project.ts'
import type { Post } from '../../enterprise/entities/value-objects/post.ts'
import type { ProjectDetails } from '../../enterprise/entities/value-objects/project-details.ts'

export type ProjectQuery = {
  title?: string
  semester?: number
  publishedYear?: number
  authorId?: string
  subjectId?: string
  trailsIds?: string[]
}

export interface ProjectsRepository {
  findById(id: string): Promise<Project | null>
  findDetailsById(id: string): Promise<ProjectDetails | null>
  findManyPostsByQuery(query: ProjectQuery): Promise<Post[]>
  findAll(): Promise<Project[]>
  findAllPosts(): Promise<Post[]>
  create(project: ProjectProps): Promise<void>
  save(project: Project): Promise<void>
  delete(id: string): Promise<void>
}
