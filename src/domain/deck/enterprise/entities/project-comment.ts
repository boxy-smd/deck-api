import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'

export interface ProjectCommentProps {
  projectId: UniqueEntityID
  commentId: UniqueEntityID
}

export class ProjectComment extends Entity<ProjectCommentProps> {
  get projectId() {
    return this.props.projectId
  }

  get commentId() {
    return this.props.commentId
  }

  static create(
    props: ProjectCommentProps,
    id?: UniqueEntityID,
  ): ProjectComment {
    return new ProjectComment(props, id)
  }
}
