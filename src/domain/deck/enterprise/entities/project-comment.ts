import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import type { Optional } from '@/core/types/optional.ts'
import { Comment, type CommentProps } from './comment.ts'

export interface ProjectCommentProps extends CommentProps {
  projectId: UniqueEntityID
}

export class ProjectComment extends Comment<ProjectCommentProps> {
  get projectId() {
    return this.props.projectId
  }

  static create(
    props: Optional<ProjectCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): ProjectComment {
    return new ProjectComment(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
      },
      id,
    )
  }
}
