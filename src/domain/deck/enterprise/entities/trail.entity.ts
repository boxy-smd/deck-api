import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import type { Optional } from '@/core/types/optional.ts'
import type { Student } from '@/domain/community/enterprise/student.entity.ts'
import type { Project } from './project.entity.ts'

export interface TrailProps {
  name: string
  createdAt: Date
  updatedAt?: Date
  students?: Student[]
  projects?: Project[]
}

export class Trail extends Entity<TrailProps> {
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

  get students(): Student[] {
    return this.props.students || []
  }

  set students(value: Student[]) {
    this.props.students = value
  }

  get projects(): Project[] {
    return this.props.projects || []
  }

  set projects(value: Project[]) {
    this.props.projects = value
  }

  static create(
    props: Optional<TrailProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Trail {
    return new Trail(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )
  }
}
