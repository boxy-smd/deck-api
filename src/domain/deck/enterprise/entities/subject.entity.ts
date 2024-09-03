import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import type { Optional } from '@/core/types/optional.ts'
import type { Project } from './project.entity.ts'

export interface SubjectProps {
  name: string
  createdAt: Date
  updatedAt?: Date
  projects?: Project[]
}

export class Subject extends Entity<SubjectProps> {
  get name(): string {
    return this.props.name
  }

  set name(value: string) {
    this.props.name = value
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  set updatedAt(value: Date) {
    this.props.updatedAt = value
  }

  get projects(): Project[] {
    return this.props.projects || []
  }

  set projects(value: Project[]) {
    this.props.projects = value
  }

  static create(
    props: Optional<SubjectProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Subject {
    return new Subject(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )
  }
}
