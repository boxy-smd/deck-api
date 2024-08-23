import { Entity } from '../core/interfaces/entity.ts'

interface ProfessorProps {
  name: string
  createdAt: Date
  updatedAt: Date
  projectIds: string[]
}

export class Professor extends Entity<ProfessorProps> {
  get name(): string {
    return this.props.name
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  static create(props: ProfessorProps, id?: string): Professor {
    return new Professor(props, id)
  }
}
