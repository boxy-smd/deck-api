import { Entity } from '../core/interfaces/entity.ts'
import type { Replace } from '../core/logic/replace.ts'
import type { Project } from './project.entity.ts'
import type { User } from './user.entity.ts'

export interface TrailProps {
  name: string
  createdAt: Date
  updatedAt: Date
  users?: User[]
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

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  set updatedAt(value: Date) {
    this.props.updatedAt = value
  }

  get users(): User[] {
    return this.props.users || []
  }

  set users(value: User[]) {
    this.props.users = value
  }

  get projects(): Project[] {
    return this.props.projects || []
  }

  set projects(value: Project[]) {
    this.props.projects = value
  }

  static create(
    props: Replace<
      TrailProps,
      {
        createdAt?: Date
        updatedAt?: Date
        users?: User[]
        projects?: Project[]
      }
    >,
    id?: string,
  ): Trail {
    return new Trail(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
        users: props.users || [],
        projects: props.projects || [],
      },
      id,
    )
  }
}
