import { Entity } from '../core/interfaces/entity.ts'

export interface CommentProps {
  content: string
  createdAt: Date
  updatedAt: Date
  userId: string
  projectId: string
}

export class Comment extends Entity<CommentProps> {
  get content(): string {
    return this.props.content
  }

  set content(value: string) {
    this.props.content = value
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  set updatedAt(value: Date) {
    this.props.updatedAt = value
  }

  get userId(): string {
    return this.props.userId
  }

  set userId(value: string) {
    this.props.userId = value
  }

  get projectId(): string {
    return this.props.projectId
  }

  set projectId(value: string) {
    this.props.projectId = value
  }

  static create(props: CommentProps, id?: string): Comment {
    return new Comment(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id,
    )
  }
}
