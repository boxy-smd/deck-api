import type { StudentProfile } from '@/@core/domain/users/entities/student-profile'
import { Entity } from '@/@shared/kernel/kernel/entity'
import type { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import type { Optional } from '@/@shared/kernel/types/optional'
import type { Comment } from './comment'

export interface ReportProps {
  content: string
  isResolved: boolean

  authorId: UniqueEntityID<StudentProfile>
  commentId: UniqueEntityID<Comment>
}

export class Report extends Entity<ReportProps> {
  // --- 1. Factory methods ---
  static create(
    props: Optional<ReportProps, 'isResolved'>,
    id?: UniqueEntityID,
  ): Report {
    return new Report(
      {
        ...props,
        isResolved: false,
      },
      id,
    )
  }

  static reconstitute(
    props: ReportProps,
    id: UniqueEntityID,
    createdAt: Date,
    updatedAt: Date,
  ): Report {
    return new Report(props, id, createdAt, updatedAt)
  }

  // --- 2. Methods ---
  public resolve() {
    this.props.isResolved = true
    this.touch()
  }

  // --- 3. Getters ---
  get content() {
    return this.props.content
  }

  get isResolved() {
    return this.props.isResolved
  }

  get authorId() {
    return this.props.authorId
  }

  get commentId() {
    return this.props.commentId
  }
}
