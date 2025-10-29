import type { UniqueEntityID } from '@/shared/kernel/unique-entity-id'

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

export class CommentWithAuthor {
  public readonly commentId: UniqueEntityID
  public readonly content: string
  public readonly createdAt: Date
  public readonly updatedAt: Date
  public readonly authorId: UniqueEntityID
  public readonly authorName: string
  public readonly authorUsername: string
  public readonly authorProfileUrl: string | null
  public readonly projectId: UniqueEntityID

  private constructor(props: CommentWithAuthorProps) {
    this.commentId = props.commentId
    this.content = props.content
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
    this.authorId = props.authorId
    this.authorName = props.authorName
    this.authorUsername = props.authorUsername
    this.authorProfileUrl = props.authorProfileUrl
    this.projectId = props.projectId
  }

  static create(props: CommentWithAuthorProps): CommentWithAuthor {
    return new CommentWithAuthor(props)
  }
}
