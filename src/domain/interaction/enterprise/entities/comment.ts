import type { StudentProfile } from '@/domain/authentication/enterprise/entities/student-profile'
import type { Project } from '@/domain/projects/enterprise/entities/project'
import { Entity } from '@/shared/kernel/entity'
import type { UniqueEntityID } from '@/shared/kernel/unique-entity-id'
import type { Optional } from '@/shared/types/optional'
import { Report } from './report'

export interface CommentProps {
  content: string

  authorId: UniqueEntityID<StudentProfile>
  projectId: UniqueEntityID<Project>
  reports: Set<Report>
}

export class Comment extends Entity<CommentProps> {
  // --- 1. Factory methods ---
  static create(
    props: Optional<CommentProps, 'reports'>,
    id?: UniqueEntityID,
  ): Comment {
    return new Comment(
      {
        ...props,
        reports: new Set(),
      },
      id,
    )
  }

  static reconstitute(
    props: CommentProps,
    id: UniqueEntityID,
    createdAt: Date,
    updatedAt: Date,
  ): Comment {
    return new Comment(props, id, createdAt, updatedAt)
  }

  // --- 2. Methods ---
  public updateContent(newContent: string) {
    this.props.content = newContent
  }

  public report(content: string, authorId: UniqueEntityID<StudentProfile>) {
    const report = Report.create({
      content: content,
      authorId: authorId,
      commentId: this.id,
    })

    this.props.reports.add(report)
    this.touch()
  }

  // --- 3. Getters ---
  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get projectId() {
    return this.props.projectId
  }

  get reports() {
    return [...this.props.reports]
  }
}
