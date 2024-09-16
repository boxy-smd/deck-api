import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { ValueObject } from '@/core/entities/value-object.ts'

interface CommentWithAuthorProps {
  id: UniqueEntityID
  content: string
  createdAt: Date
  updatedAt?: Date
  author: {
    name: string
    username: string
    profileUrl?: string
  }
  authorId: UniqueEntityID
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  get id() {
    return this.props.id
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get author() {
    return this.props.author
  }

  get authorId() {
    return this.props.authorId
  }

  static create(props: CommentWithAuthorProps): CommentWithAuthor {
    return new CommentWithAuthor(props)
  }
}
