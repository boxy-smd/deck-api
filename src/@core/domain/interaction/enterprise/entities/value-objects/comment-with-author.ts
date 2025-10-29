import { ValueObject } from '@/@shared/kernel/kernel/value-object'
import type { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'

export interface CommentWithAuthorProps {
  commentId: UniqueEntityID
  content: string
  createdAt: Date
  updatedAt: Date
  authorId: UniqueEntityID
  authorName: string
  authorUsername: string
  authorProfileUrl: string | null
  projectId: UniqueEntityID
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  get commentId(): UniqueEntityID {
    return this.props.commentId
  }

  get content(): string {
    return this.props.content
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  get authorId(): UniqueEntityID {
    return this.props.authorId
  }

  get authorName(): string {
    return this.props.authorName
  }

  get authorUsername(): string {
    return this.props.authorUsername
  }

  get authorProfileUrl(): string | null {
    return this.props.authorProfileUrl
  }

  get projectId(): UniqueEntityID {
    return this.props.projectId
  }

  static create(props: CommentWithAuthorProps): CommentWithAuthor {
    return new CommentWithAuthor(props)
  }

  toDTO() {
    return {
      id: this.commentId.toString(),
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      author: {
        id: this.authorId.toString(),
        name: this.authorName,
        username: this.authorUsername,
        profileUrl: this.authorProfileUrl,
      },
      projectId: this.projectId.toString(),
    }
  }
}
