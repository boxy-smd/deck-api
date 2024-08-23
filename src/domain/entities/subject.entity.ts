import { Entity } from '../core/interfaces/entity.ts'

interface SubjectProps {
  name: string
  code: string
  createdAt: Date
  updatedAt: Date
}

export class Subject extends Entity<SubjectProps> {
  get name(): string {
    return this.props.name
  }

  get code(): string {
    return this.props.code
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  static create(props: SubjectProps, id?: string): Subject {
    return new Subject(props, id)
  }
}
