import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import type { Optional } from '@/core/types/optional.ts'

export interface ReportProps {
  content: string
  isResolved: boolean
  createdAt: Date
  updatedAt?: Date
  authorId: UniqueEntityID
  commentId: UniqueEntityID
}

export class Report extends Entity<ReportProps> {
  get content() {
    return this.props.content
  }

  get isResolved() {
    return this.props.isResolved
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

  get commentId() {
    return this.props.commentId
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set isResolved(isResolved: boolean) {
    this.props.isResolved = isResolved
    this.touch()
  }

  set authorId(authorId: UniqueEntityID) {
    this.props.authorId = authorId
    this.touch()
  }

  set commentId(commentId: UniqueEntityID) {
    this.props.commentId = commentId
    this.touch()
  }

  static create(
    props: Optional<ReportProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Report {
    return new Report(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )
  }
}
