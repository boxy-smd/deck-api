import type { Project } from '../../enterprise/entities/project'
import type { ProjectAuthor } from '../value-objects/project-author.vo'
import type { ProjectSubject } from '../value-objects/project-subject.vo'
import type { ProjectTrail } from '../value-objects/project-trail.vo'

export type {
  ProjectAuthorDTO,
  ProjectSubjectDTO,
  ProjectTrailDTO,
} from './project.dto'

export interface ProjectSummaryDTO {
  id: string
  title: string
  description: string
  bannerUrl: string | null
  publishedYear: number | null
  semester: number | null
  createdAt: Date
  author: {
    name: string
    username: string
    profileUrl: string | null
  }
  subject: {
    name: string
  } | null
  trails: Array<{
    name: string
  }>
}

interface ProjectWithRelations {
  project: Project
  author: ProjectAuthor
  subject: ProjectSubject | null
  trails: ProjectTrail[]
}

// biome-ignore lint/complexity/noStaticOnlyClass: This is a DTO mapper
export class ProjectSummaryMapper {
  static toDTO(data: ProjectWithRelations): ProjectSummaryDTO {
    const { project, author, subject, trails } = data

    return {
      id: project.id.toString(),
      title: project.title,
      description: project.description || '',
      bannerUrl: project.bannerUrl || null,
      publishedYear: project.publishedYear || null,
      semester: project.semester || null,
      createdAt: project.createdAt,
      author: author.toDTO(),
      subject: subject?.toDTO() || null,
      trails: trails.map(trail => trail.toDTO()),
    }
  }
}
