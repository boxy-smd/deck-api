export interface ProjectAuthorDTO {
  id: string
  name: string
  username: string
  profileUrl: string | null
}

export interface ProjectSubjectDTO {
  id: string
  name: string
}

export interface ProjectTrailDTO {
  id: string
  name: string
}

export interface ProjectProfessorDTO {
  id: string
  name: string
}

export interface ProjectDTO {
  id: string
  title: string
  description: string
  bannerUrl: string | null
  content: string | null
  publishedYear: number | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  semester: number | null
  createdAt: Date
  updatedAt: Date | null
  authorId: string
  author: ProjectAuthorDTO
  subjectId: string | null
  subject: ProjectSubjectDTO | null
  trails: ProjectTrailDTO[]
  professors: ProjectProfessorDTO[]
}

export class ProjectDTOMapper {
  static toDTO(raw: ProjectDTO): ProjectDTO {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      bannerUrl: raw.bannerUrl,
      content: raw.content,
      publishedYear: raw.publishedYear,
      status: raw.status,
      semester: raw.semester,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      authorId: raw.authorId,
      author: raw.author,
      subjectId: raw.subjectId,
      subject: raw.subject,
      trails: raw.trails,
      professors: raw.professors,
    }
  }
}
