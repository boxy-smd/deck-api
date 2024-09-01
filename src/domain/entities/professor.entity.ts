import { Entity } from '../core/interfaces/entity.ts'
import type { Replace } from '../core/logic/replace.ts'
import type { Project } from './project.entity.ts'

export interface ProfessorProps {
  name: string
  createdAt: Date
  updatedAt: Date
  projects?: Project[]
}

export class Professor extends Entity<ProfessorProps> {
  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt
  }

  get projects(): Project[] {
    return this.props.projects || []
  }

  set projects(projects: Project[]) {
    this.props.projects = projects
  }

  static create(
    {
      createdAt = new Date(),
      updatedAt = new Date(),
      ...props
    }: Replace<
      ProfessorProps,
      {
        createdAt?: Date
        updatedAt?: Date
      }
    >,
    id?: string,
  ): Professor {
    return new Professor(
      {
        ...props,
        createdAt,
        updatedAt,
      },
      id,
    )
  }
}
