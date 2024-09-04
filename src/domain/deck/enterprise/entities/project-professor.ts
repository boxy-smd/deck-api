import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'

interface ProjectProfessorProps {
  projectId: UniqueEntityID
  professorId: UniqueEntityID
}

export class ProjectProfessor extends Entity<ProjectProfessorProps> {
  get projectId() {
    return this.props.projectId
  }

  get professorId() {
    return this.props.professorId
  }

  static create(
    props: ProjectProfessorProps,
    id?: UniqueEntityID,
  ): ProjectProfessor {
    return new ProjectProfessor(props, id)
  }
}
