import { Entity } from '../core/interfaces/entity.ts'

interface ProjectProps {
  title: string
  description: string
  content: string
  publishedYear: number
  status: string
  semester: number
  relatedLinks: string[]
  allowComments: boolean
  createdAt: Date
  updatedAt: Date
  authorId: string
  subjectId: string
  bannerUrl: string
  professorsIds: string[]
}

export class Project extends Entity<ProjectProps> {
  get title(): string {
    return this.props.title
  }

  get description(): string {
    return this.props.description
  }

  get content(): string {
    return this.props.content
  }

  get semester(): number {
    return this.props.semester
  }

  get relatedLinks(): string[] {
    return this.props.relatedLinks
  }

  get allowComments(): boolean {
    return this.props.allowComments
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  get authorId(): string {
    return this.props.authorId
  }

  get subjectId(): string {
    return this.props.subjectId
  }

  get bannerUrl(): string {
    return this.props.bannerUrl
  }

  static create(props: ProjectProps, id?: string): Project {
    return new Project(props, id)
  }
}
