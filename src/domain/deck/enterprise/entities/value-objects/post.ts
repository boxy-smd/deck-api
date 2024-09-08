import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { ValueObject } from '@/core/entities/value-object.ts'
import type { ProjectStatusEnum } from '../project.ts'

interface PostProps {
  id: UniqueEntityID
  title: string
  description: string
  bannerUrl: string
  content?: string
  publishedYear: number
  status: ProjectStatusEnum
  semester: number
  createdAt: Date
  updatedAt?: Date
  author: {
    name: string
    username: string
    profileUrl?: string
  }
  authorId: UniqueEntityID
  subject?: string
  subjectId?: UniqueEntityID
  trails: string[]
  professors?: string[]
}

export class Post extends ValueObject<PostProps> {
  get id() {
    return this.props.id
  }

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
    return this.props.content
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

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt || null
  }

  get author() {
    return this.props.author
  }

  get authorId() {
    return this.props.authorId
  }

  get subject() {
    return this.props.subject || null
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

  static create(props: PostProps): Post {
    return new Post(props)
  }
}
