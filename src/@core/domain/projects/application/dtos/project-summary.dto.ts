import type {
  ProjectAuthorDTO,
  ProjectDTO,
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
  author: ProjectAuthorDTO
  subject: ProjectSubjectDTO | null
  trails: ProjectTrailDTO[]
}

// biome-ignore lint/complexity/noStaticOnlyClass: This is a DTO mapper
export class ProjectSummaryDTOMapper {
  static fromProject(project: ProjectDTO): ProjectSummaryDTO {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      bannerUrl: project.bannerUrl,
      publishedYear: project.publishedYear,
      semester: project.semester,
      createdAt: project.createdAt,
      author: project.author,
      subject: project.subject,
      trails: project.trails,
    }
  }

  static fromRaw(raw: {
    id: string
    title: string
    description: string
    bannerUrl: string | null
    publishedYear: number | null
    semester: number | null
    createdAt: Date
    author: ProjectAuthorDTO
    subject: ProjectSubjectDTO | null
    trails: ProjectTrailDTO[]
  }): ProjectSummaryDTO {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      bannerUrl: raw.bannerUrl,
      publishedYear: raw.publishedYear,
      semester: raw.semester,
      createdAt: raw.createdAt,
      author: raw.author,
      subject: raw.subject,
      trails: raw.trails,
    }
  }
}
