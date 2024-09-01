import { Entity } from '../core/interfaces/entity.ts'
import type { Replace } from '../core/logic/replace.ts'

export interface CommentProps {
  content: string
  createdAt: Date
  updatedAt: Date
  authorId: string
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

  get authorId(): string {
    return this.props.authorId
  }

  set authorId(value: string) {
    this.props.authorId = value
  }

  get projectId(): string {
    return this.props.projectId
  }

  set projectId(value: string) {
    this.props.projectId = value
  }

  static create(
    {
      createdAt = new Date(),
      updatedAt = new Date(),
      ...props
    }: Replace<
      CommentProps,
      {
        createdAt?: Date
        updatedAt?: Date
      }
    >,
    id?: string,
  ): Comment {
    return new Comment(
      {
        ...props,
        createdAt,
        updatedAt,
      },
      id,
    )
  }
}
