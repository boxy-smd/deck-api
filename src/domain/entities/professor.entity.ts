import { Entity } from '../../core/entities/entity.ts'
import type { Optional } from '../../core/types/optional.ts'
import type { Project } from './project.entity.ts'

export interface ProfessorProps {
  name: string
  createdAt: Date
  updatedAt?: Date
  projects?: Project[]
}

export class Professor extends Entity<ProfessorProps> {
  get name(): string {
    return this.props.name
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  get projects(): Project[] {
    return this.props.projects || []
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set projects(projects: Project[]) {
    this.props.projects = projects
    this.touch()
  }

  static create(
    props: Optional<ProfessorProps, 'createdAt'>,
    id?: string,
  ): Professor {
    return new Professor(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )
  }
}
