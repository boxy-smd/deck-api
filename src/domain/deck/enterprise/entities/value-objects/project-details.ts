import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { ValueObject } from '@/core/entities/value-object.ts'
import type { Professor } from '../professor.ts'
import type { ProjectStatusEnum } from '../project.ts'
import type { Trail } from '../trail.ts'

interface ProjectDetailsProps {
  title: string
  description: string
  bannerUrl: string
  content?: string
  publishedYear: number
  status: ProjectStatusEnum
  semester: number
  allowComments: boolean
  createdAt: Date
  updatedAt?: Date
  author: {
    name: string
    username: string
  }
  authorId: UniqueEntityID
  subject?: string
  subjectId?: UniqueEntityID
  trails: Trail[]
  professors?: Professor[]
  comments?: Comment[]
}

export class ProjectDetails extends ValueObject<ProjectDetailsProps> {
  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get bannerUrl() {
    return this.props.bannerUrl
  }

  get content() {
    return this.props.content || ''
  }

  get publishedYear() {
    return this.props.publishedYear
  }

  get status() {
    return this.props.status
  }

  get semester() {
    return this.props.semester
  }

  get allowComments() {
    return this.props.allowComments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt || null
  }

  get authorId() {
    return this.props.authorId
  }

  get subjectId() {
    return this.props.subjectId || null
  }

  get trails() {
    return this.props.trails
  }

  get professors() {
    return this.props.professors || []
  }

  get comments() {
    return this.props.comments || []
  }

  static create(props: ProjectDetailsProps): ProjectDetails {
    return new ProjectDetails(props)
  }
}
