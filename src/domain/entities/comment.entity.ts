import { Entity } from '../../core/entities/entity.ts'
import type { UniqueEntityID } from '../../core/entities/unique-entity-id.ts'
import type { Optional } from '../../core/types/optional.ts'

export interface CommentProps {
  content: string
  createdAt: Date
  updatedAt?: Date
  authorId: UniqueEntityID
  projectId: UniqueEntityID
}

export class Comment extends Entity<CommentProps> {
  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get authorId() {
    return this.props.authorId
  }

  get projectId() {
    return this.props.projectId
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(value: string) {
    this.props.content = value
    this.touch()
  }

  static create(
    props: Optional<CommentProps, 'createdAt'>,
    id?: string,
  ): Comment {
    return new Comment(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )
  }
}
