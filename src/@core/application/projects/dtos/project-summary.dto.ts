import type { ProjectDTO } from './project.dto'

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
    id: string
    name: string
    username: string
    profileUrl: string | null
  }
  subject: {
    id: string
    name: string
  } | null
  trails: Array<{
    id: string
    name: string
  }>
  professors: Array<{
    id: string
    name: string
  }>
  allowComments: boolean
  updatedAt: Date | null
}

export class ProjectSummaryMapper {
  static toDTO(project: ProjectDTO): ProjectSummaryDTO {
    return {
      id: project.id.toString(),
      title: project.title,
      description: project.description || '',
      bannerUrl: project.bannerUrl || null,
      publishedYear: project.publishedYear || null,
      semester: project.semester || null,
      createdAt: project.createdAt,
      author: project.author,
      subject: project.subject,
      trails: project.trails,
      professors: project.professors,
      allowComments: project.allowComments,
      updatedAt: project.updatedAt,
    }
  }
}
