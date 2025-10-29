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
