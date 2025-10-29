import { ValueObject } from '@/@shared/kernel/kernel/value-object'

interface ProjectSummaryProps {
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

export class ProjectSummary extends ValueObject<ProjectSummaryProps> {
  get id(): string {
    return this.props.id
  }

  get title(): string {
    return this.props.title
  }

  get description(): string {
    return this.props.description
  }

  get bannerUrl(): string | null {
    return this.props.bannerUrl
  }

  get publishedYear(): number | null {
    return this.props.publishedYear
  }

  get semester(): number | null {
    return this.props.semester
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get author() {
    return this.props.author
  }

  get subject() {
    return this.props.subject
  }

  get trails() {
    return this.props.trails
  }

  static create(props: ProjectSummaryProps): ProjectSummary {
    return new ProjectSummary(props)
  }

  toDTO() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      bannerUrl: this.bannerUrl,
      publishedYear: this.publishedYear,
      semester: this.semester,
      createdAt: this.createdAt,
      author: this.author,
      subject: this.subject,
      trails: this.trails,
    }
  }
}
