import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { ValueObject } from '@/core/entities/value-object.ts'
import type { Post } from './post.ts'

interface StudentProfileProps {
  id: UniqueEntityID
  name: string
  username: string
  about?: string
  profileUrl?: string
  semester: number
  createdAt: Date
  updatedAt?: Date
  trails: string[]
  posts: Post[]
}

export class StudentProfile extends ValueObject<StudentProfileProps> {
  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get username() {
    return this.props.username
  }

  get about() {
    return this.props.about
  }

  get profileUrl() {
    return this.props.profileUrl
  }

  get semester() {
    return this.props.semester
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get trails() {
    return this.props.trails
  }

  get posts() {
    return this.props.posts
  }

  static create(props: StudentProfileProps): StudentProfile {
    return new StudentProfile(props)
  }
}
