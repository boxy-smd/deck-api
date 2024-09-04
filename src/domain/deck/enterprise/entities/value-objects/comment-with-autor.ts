import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { ValueObject } from '@/core/entities/value-object.ts'

interface CommentWithAuthorProps {
  content: string
  commentId: UniqueEntityID
  author: {
    name: string
    username: string
  }
  authorId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  get content() {
    return this.props.content
  }

  get commentId() {
    return this.props.commentId
  }

  get author() {
    return this.props.author
  }

  get authorId() {
    return this.props.authorId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: CommentWithAuthorProps): CommentWithAuthor {
    return new CommentWithAuthor(props)
  }
}
